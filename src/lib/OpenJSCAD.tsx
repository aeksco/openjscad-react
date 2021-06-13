import React from "react";
import { OpenJSCADProps } from "./types";
import {
    prepareRender,
    drawCommands,
    cameras,
    controls,
    entitiesFromSolids,
} from "@jscad/regl-renderer";

// // // //
// From Viewer Component
const perspectiveCamera = cameras.perspective;
const orbitControls = controls.orbit;

let numberOfInstances = 0;

const rotateSpeed = 0.002;
const panSpeed = 0.75;
const zoomSpeed = 0.08;

// prepare the renderer
// type GridOptions = any;
// type AxisOptions = any;
type SetupOptions = any;

// Setup default grid/axis/viewer options
// const DEFAULT_GRID_OPTIONS: any = {
//     show: true,
//     color: [0, 0, 0, 1],
//     subColor: [0, 0, 1, 0.5],
//     fadeOut: false,
//     transparent: true,
//     size: [100, 100],
//     ticks: [100, 10],
// };

// const DEFAULT_AXIS_OPTIONS: any = {
//     show: true,
// };

const DEFAULT_VIEWER_OPTIONS: any = {
    rotateSpeed: 0.002,
    zoomSpeed: 0.08,
    doubleClickSpeed: 300, // ms
};

// assemble the options for rendering

// const originalGridOptions: GridOptions = {
//     visuals: {
//         drawCmd: "drawGrid",
//         show: DEFAULT_GRID_OPTIONS.show,
//         color: DEFAULT_GRID_OPTIONS.color,
//         subColor: DEFAULT_GRID_OPTIONS.subColor,
//         fadeOut: DEFAULT_GRID_OPTIONS.fadeOut,
//         transparent: DEFAULT_GRID_OPTIONS.transparent,
//     },
//     size: DEFAULT_GRID_OPTIONS.size,
//     ticks: DEFAULT_GRID_OPTIONS.ticks,
// };

// const gridOptions: GridOptions = {
//     ...originalGridOptions,
//     visuals: {
//         ...originalGridOptions.visuals,
//     },
// };

// // Setup Axis Options
// const axisOptions: AxisOptions = {
//     visuals: {
//         drawCmd: "drawAxis",
//         show: DEFAULT_AXIS_OPTIONS.show,
//     },
// };

// TODO - get different container heights
// const width = containerElement.clientWidth
// const height = containerElement.clientHeight
const width = 800;
const height = 600;

/**
 * OpenJSCADState
 * Encapsulates the state of the OpenJSCADProcessor component
 */
export interface OpenJSCADViewerState {
    camera: any; // TODO - update these types
    controls: any; // TODO - update these types
    content: any; // TODO - update these types
    rotateDelta: [number, number];
    panDelta: [number, number];
    zoomDelta: number;
    mouse: {
        buttons: number;
        shiftKey: boolean;
        isOrbiting: boolean;
        lastClick: number;
        lastZoom: number;
    };
}

// // // //

/**
 * OpenJSCADProcessor
 * @param props - see OpenJSCADProps
 */
export class OpenJSCAD extends React.Component<
    OpenJSCADProps,
    OpenJSCADViewerState
> {
    id: number;
    _ismounted: boolean = false;
    viewerContext: React.RefObject<HTMLDivElement>;

    constructor(props: OpenJSCADProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.doRotatePanZoom = this.doRotatePanZoom.bind(this);

        this.viewerContext = React.createRef();

        // Auto-increments the number of instances
        numberOfInstances++;
        this.id = numberOfInstances;

        // TODO - put this behind DEBUG flag
        console.log("numberOfInstances");
        console.log(numberOfInstances);

        // Defines default camera settings
        const camera: any = {
            ...Object.assign({}, perspectiveCamera.defaults),
            position: [150, -180, 233],
        };

        // const count = Number(Date.now()
        //     .toString()
        //     .split("")
        //     .pop())
        const { solids } = props;

        this.state = {
            camera,
            // Set default controls
            controls: {
                ...orbitControls.defaults,
            },
            content: {
                // define the visual content
                camera: camera,
                drawCommands: {
                    drawGrid: drawCommands.drawGrid,
                    drawAxis: drawCommands.drawAxis,
                    drawMesh: drawCommands.drawMesh,
                },
                entities: [
                    // gridOptions,
                    // {
                    //     ...originalGridOptions,
                    //     visuals: originalGridOptions.visuals,
                    // },
                    // axisOptions,
                    ...entitiesFromSolids({}, solids),
                ],
            },
            rotateDelta: [0, 0],
            panDelta: [0, 0],
            zoomDelta: 0,
            // state to track mouse
            mouse: {
                buttons: 0,
                shiftKey: false,
                isOrbiting: false,
                lastClick: 0, // ms
                lastZoom: 0,
            },
        };
    }

    // log(message: any, ...optionalParams: any[]) {
    //   if (this.props.debug) {
    //     console.log(message, ...optionalParams);
    //   }
    // }

    // // // //

    onMouseDown(event: any) {
        this.setState({
            mouse: {
                ...this.state.mouse,
                buttons: event.buttons,
                shiftKey: event.hiftKey,
                isOrbiting: true,
            },
        });
    }

    onMouseUp(event: any) {
        // handle double clicks
        const now = Date.now();
        let changeZoomDelta = false;
        const state = this.state;
        if (state.mouse.lastClick) {
            const ms = now - state.mouse.lastClick;
            // if (ms < this.viewerOptions.doubleClickSpeed) {
            if (ms < DEFAULT_VIEWER_OPTIONS.doubleClickSpeed) {
                // TODO - replace with default
                if (state.mouse.isOrbiting) {
                    changeZoomDelta = true;
                }
            }
        }

        const updatedState = {
            zoomDelta: changeZoomDelta
                ? Number.POSITIVE_INFINITY
                : state.zoomDelta,
            mouse: {
                ...state.mouse,
                lastClick: now,
                // reset state
                buttons: 0,
                shiftKey: false,
                isOrbiting: false,
            },
        };

        this.setState(updatedState);
    }

    // // // //

    onMouseMove(e: any) {
        const state = this.state;
        if (state.mouse.isOrbiting) {
            if (state.mouse.shiftKey) {
                this.setState({
                    panDelta: [
                        (state.panDelta[0] -= e.movementX),
                        (state.panDelta[1] += e.movementY),
                    ],
                });
            } else {
                this.setState({
                    rotateDelta: [
                        (state.rotateDelta[0] += e.movementX),
                        (state.rotateDelta[1] -= e.movementY),
                    ],
                });
            }
        }
    }

    // // // //

    // TODO - fix type here
    // onWheel(event: React.WheelEvent<HTMLDivElement>) {
    onWheel(event: WheelEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            zoomDelta: event.deltaY,
        });
    }

    // // // //

    doRotatePanZoom() {
        let { rotateDelta, panDelta, zoomDelta, controls, camera } = this.state;
        const updatedState = { ...this.state };
        if (rotateDelta[0] || rotateDelta[1]) {
            const updated = orbitControls.rotate(
                { controls, camera, speed: rotateSpeed },
                rotateDelta,
            );
            updatedState.controls = { ...controls, ...updated.controls };
            updatedState.rotateDelta[0] = 0;
            updatedState.rotateDelta[1] = 0;
        }

        if (panDelta[0] || panDelta[1]) {
            const updated = orbitControls.pan(
                { controls, camera, speed: panSpeed },
                panDelta,
            );
            updatedState.camera.position = updated.camera.position;
            updatedState.camera.target = updated.camera.target;
            updatedState.panDelta[0] = 0;
            updatedState.panDelta[1] = 0;
        }

        if (zoomDelta) {
            if (Number.isFinite(zoomDelta)) {
                const updated = orbitControls.zoom(
                    { controls, camera, speed: zoomSpeed },
                    zoomDelta,
                );
                updatedState.controls = { ...controls, ...updated.controls };
            } else {
                const entities = updatedState.content.entities;
                const updated = orbitControls.zoomToFit({
                    controls,
                    camera,
                    entities,
                });
                updatedState.controls = { ...controls, ...updated.controls };
            }
            updatedState.zoomDelta = 0;
        }

        this.setState(updatedState);
    }

    componentDidUpdate(prevProps: OpenJSCADProps) {
        // console.log(props);

        // TODO - how can we detect change in props.solids?
        const oldSolids = JSON.stringify(prevProps.solids);
        const newSolids = JSON.stringify(this.props.solids);

        if (newSolids !== oldSolids) {
            console.log("componentDidUpdate - props.solids");
            this.setState({
                ...this.state,
                content: {
                    camera: this.state.content.camera,
                    drawCommands: {
                        drawGrid: drawCommands.drawGrid,
                        drawAxis: drawCommands.drawAxis,
                        drawMesh: drawCommands.drawMesh,
                    },
                    entities: [
                        // gridOptions,
                        // {
                        //     ...originalGridOptions,
                        //     visuals: {
                        //         ...originalGridOptions.visuals,
                        //         cacheId: false,
                        //     },
                        // },
                        // axisOptions,
                        ...entitiesFromSolids({}, this.props.solids),
                    ],
                },
            });
            return;
        }
    }

    componentDidMount() {
        this._ismounted = true;
        console.log("COMPONENT DID MOUNT");
        if (typeof window == "undefined" || typeof document == "undefined") {
            console.log("WINDOW COMPROMISED?");
            return;
        }

        if (!this.viewerContext.current) {
            console.log("NOT YET MOUNTED");
            return;
        }

        // Define setup options
        const setupOptions: SetupOptions = {
            glOptions: { container: this.viewerContext.current },
        };

        const renderer = prepareRender(setupOptions);
        // console.log(renderer);

        // the heart of rendering, as themes, controls, etc change
        const updateAndRender = (timestamp: any) => {
            if (this._ismounted === false) {
                return;
            }

            this.doRotatePanZoom();

            const updates = orbitControls.update({
                controls: this.state.controls,
                camera: this.state.camera,
            });

            // @ts-ignore
            this.state.controls = {
                ...this.state.controls,
                ...updates.controls,
            };
            this.state.camera.position = updates.camera.position;
            perspectiveCamera.update(this.state.camera);

            // if (!this.state.content)
            // console.log("this.state.content");
            // console.log(this.state.content.entities);
            renderer({
                ...this.state.content,
                drawCommands: {
                    ...drawCommands,
                },
                // entities: this.state.content.entities,
                entities: [
                    ...this.state.content.entities.filter(e => {
                        return (
                            typeof drawCommands[e.visuals.drawCmd] ===
                            "function"
                        );
                    }),
                ],
            });
            window.requestAnimationFrame(updateAndRender);
        };

        // QUESTION - can we not invoke once-per ViewerComponent?
        window.requestAnimationFrame(updateAndRender);

        // Testing this..
        if (this.viewerContext.current) {
            this.viewerContext.current.addEventListener("wheel", this.onWheel, {
                passive: false,
            });
        }
    }

    componentWillUnmount() {
        // Sets _ismounted value
        // TODO - is this necessary?
        this._ismounted = false;

        // Remove "wheel" event listener
        if (this.viewerContext.current) {
            this.viewerContext.current.removeEventListener(
                "wheel",
                this.onWheel,
            );
        }

        // Log debug statement
        if (this.props.debug) {
            console.log("OpenJSCADViewer - Unmount");
        }
    }

    render() {
        const defaultStyle: React.CSSProperties = {
            width: "16cm",
            height: "16cm",
            margin: "0",
            outline: "1px solid black",
            backgroundColor: "transparent",
            overflowY: "auto",
        };
        const { style = defaultStyle } = this.props;

        if (typeof window == "undefined" || typeof document == "undefined") {
            return <div style={style}></div>;
        }

        // prepare the camera
        perspectiveCamera.setProjection(this.state.camera, this.state.camera, {
            width,
            height,
        });
        perspectiveCamera.update(this.state.camera, this.state.camera);

        return (
            <div
                style={style}
                ref={this.viewerContext}
                onMouseMoveCapture={e => {
                    this.onMouseMove(e);
                }}
                onMouseDown={e => {
                    this.onMouseDown(e);
                }}
                onMouseUp={e => {
                    this.onMouseUp(e);
                }}
            />
        );
    }
}
