import React from "react";
import {
    prepareRender,
    drawCommands,
    cameras,
    controls,
    entitiesFromSolids,
    // @ts-ignore
} from "@jscad/regl-renderer";
import { getPrimitives } from "./primitives";

// // // //

const perspectiveCamera = cameras.perspective;
const orbitControls = controls.orbit;

let numberOfInstances = 0;

const rotateSpeed = 0.002;
const panSpeed = 0.75;
const zoomSpeed = 0.08;

interface ViewerState {
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

// prepare the renderer
type GridOptions = any;
type AxisOptions = any;
type SetupOptions = any;

// Setup default grid/axis/viewer options
const DEFAULT_GRID_OPTIONS: any = {
    show: true,
    color: [0, 0, 0, 1],
    subColor: [0, 0, 1, 0.5],
    fadeOut: false,
    transparent: true,
    size: [100, 100],
    ticks: [100, 10],
};

const DEFAULT_AXIS_OPTIONS: any = {
    show: true,
};

const DEFAULT_VIEWER_OPTIONS: any = {
    rotateSpeed: 0.002,
    zoomSpeed: 0.08,
    doubleClickSpeed: 300, // ms
};

// assemble the options for rendering
const gridOptions: GridOptions = {
    visuals: {
        drawCmd: "drawGrid",
        show: DEFAULT_GRID_OPTIONS.show,
        color: DEFAULT_GRID_OPTIONS.color,
        subColor: DEFAULT_GRID_OPTIONS.subColor,
        fadeOut: DEFAULT_GRID_OPTIONS.fadeOut,
        transparent: DEFAULT_GRID_OPTIONS.transparent,
    },
    size: DEFAULT_GRID_OPTIONS.size,
    ticks: DEFAULT_GRID_OPTIONS.ticks,
};

// Setup Axis Options
const axisOptions: AxisOptions = {
    visuals: {
        drawCmd: "drawAxis",
        show: DEFAULT_AXIS_OPTIONS.show,
    },
};

// // // //
// COMPONENT STATE

// count() {
//   const state = this._data.state
//   if (state) {
//     updateSolids(state, this.$store.state.solids)
//   }
//   // update the fake DOM entry
//   return this.$store.state.count
// },
// solids() {
//   return this.$store.state.solids
// }

// // // //

// TODO - get different container heights
// const width = containerElement.clientWidth
// const height = containerElement.clientHeight
const width = 800;
const height = 600;

// // // //

interface OpenJSCADProcessorProps {
    solids: any[];
}

/**
 * OpenJSCADState
 * Encapsulates the state of the OpenJSCADProcessor component
 */
export interface OpenJSCADState {
    initializedProcessor: boolean;
}

/**
 * OpenJSCADProcessor
 * @param props - see OpenJSCADProps
 */
export class ViewerComponent extends React.Component<
    OpenJSCADProcessorProps,
    ViewerState
> {
    id: number;
    viewerContext: React.RefObject<HTMLDivElement>;
    // viewerCanvas: React.RefObject<HTMLCanvasElement>;
    // parametersTable: React.RefObject<HTMLTableElement>;
    // processor: null | Processor;

    constructor(props: OpenJSCADProcessorProps) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.doRotatePanZoom = this.doRotatePanZoom.bind(this);

        this.viewerContext = React.createRef();
        // this.viewerCanvas = React.createRef();
        // this.parametersTable = React.createRef();
        // this.processor = null;
        // this.log = this.log.bind(this);

        // Auto-increments the number of instances
        numberOfInstances++;
        this.id = numberOfInstances;

        // Defines default camera settings
        const camera: any = {
            ...Object.assign({}, perspectiveCamera.defaults),
            position: [150, -180, 233],
        };

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
                    gridOptions,
                    axisOptions,
                    // ...entitiesFromSolids({}, props.solids),
                    ...entitiesFromSolids({}, getPrimitives(1)),
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

    componentDidMount() {
        // console.log("COMPONENT DID MOUNT");
        // console.log(this.viewerContext.current);
        // this.$el.id = `viewer${this.id}`
        // this.renderer = setupRenderer(this.$el, this.$data)

        this.viewerContext.current;

        // Define setup options
        const setupOptions: SetupOptions = {
            glOptions: { container: this.viewerContext.current },
        };
        const renderer = prepareRender(setupOptions);
        // console.log(renderer);

        // the heart of rendering, as themes, controls, etc change
        const updateAndRender = (timestamp: any) => {
            window.cancelAnimationFrame(timestamp);
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

            renderer(this.state.content);
            window.requestAnimationFrame(updateAndRender);
        };

        // QUESTION - can we not invoke once-per ViewerComponent?
        window.requestAnimationFrame(updateAndRender);

        // Testing this..
        if (this.viewerContext.current) {
            this.viewerContext.current.addEventListener("wheel", this.onWheel);
        }
    }

    componentWillUnmount() {
        if (this.viewerContext.current) {
            this.viewerContext.current.removeEventListener(
                "wheel",
                this.onWheel,
            );
        }
    }

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

    render() {
        if (typeof window == "undefined" || typeof document == "undefined") {
            return (
                <div
                    style={{
                        width: "16cm",
                        height: "16cm",
                        margin: "0",
                        outline: "1px solid black",
                        backgroundColor: "transparent",
                        overflowY: "auto",
                    }}
                ></div>
            );
        }

        // prepare the camera
        perspectiveCamera.setProjection(this.state.camera, this.state.camera, {
            width,
            height,
        });
        perspectiveCamera.update(this.state.camera, this.state.camera);

        return (
            <div
                style={{
                    width: "16cm",
                    height: "16cm",
                    margin: "0",
                    outline: "1px solid black",
                    backgroundColor: "transparent",
                    overflowY: "auto",
                }}
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
            ></div>
        );
    }
}
