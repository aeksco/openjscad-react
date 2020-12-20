import React from "react";
import {
    ProcessorState,
    ProcessorStates,
    OpenJSCADProps,
    Processor,
    GenerateOutputFileParams,
} from "./types";
import * as openScadModule from "@jscad/web/src/ui/umd.js";
import { EXPORT_FORMATS } from "./constants";

// // // //

/**
 * OpenJSCADState
 * Encapsulates the state of the OpenJSCADProcessor component
 */
export interface OpenJSCADState {
    loadedDynamicImport: boolean;
    status: ProcessorState;
    outputFile: any; // TODO - fix
}

/**
 * OpenJSCADProcessor
 * @param props - see OpenJSCADProps
 */
export class OpenJSCADProcessor extends React.Component<
    OpenJSCADProps,
    OpenJSCADState
> {
    viewerContext: React.RefObject<HTMLDivElement>;
    viewerDiv: React.RefObject<HTMLDivElement>;
    viewerCanvas: React.RefObject<HTMLCanvasElement>;
    parametersTable: React.RefObject<HTMLTableElement>;
    processor: null | Processor;

    constructor(props: OpenJSCADProps) {
        super(props);

        this.viewerContext = React.createRef();
        this.viewerDiv = React.createRef();
        this.viewerCanvas = React.createRef();
        this.parametersTable = React.createRef();
        this.processor = null;

        this.log = this.log.bind(this);

        this.state = {
            loadedDynamicImport: false,
            status: ProcessorStates.empty,
            outputFile: null,
        };
    }

    log(message: any, ...optionalParams: any[]) {
        if (this.props.debug) {
            console.log(message, ...optionalParams);
        }
    }

    componentDidMount() {
        // TODO - figure out what's going on here
        // TODO - figure out what's going on here
        // TODO - figure out what's going on here
        if (openScadModule) {
            this.setState({ loadedDynamicImport: true });
            return;
        }

        // TODO - remove this
        // // @ts-ignore
        // import("@jscad/web").then((module) => {
        //   // Set openjscad module
        //   openScadModule = module.default;

        //   // Set state.ready to true
        //   this.setState({ loadedDynamicImport: true });
        // });
    }

    componentDidUpdate(prevProps: OpenJSCADProps, prevState: OpenJSCADState) {
        // Short-circuit if we have not loaded the dynamic import yet
        if (!openScadModule) {
            this.log("NO MODULE?");
            // TODO - does this ever get hit? Do we need this, or want to add a timeout here?
            return;
        }

        // Short-circuit if dynamic import hasn't loaded yet
        if (!this.state.loadedDynamicImport) {
            this.log("NO IMPORT LOADED?");
            return;
        }

        // If the viewerCanvas hasn't been rendered yet,
        // short-circut `componentDidUpdate` and invoke forceUpdate after a 500ms delay
        if (!this.viewerCanvas.current) {
            this.log("NO VIEWER CANVAS PRESENT");
            setTimeout(() => {
                this.forceUpdate();
            }, 500);
            return;
        }

        // Logs the processor
        this.log(this.processor);

        // Short-circuit function if current state is rendering
        if (this.state.status === ProcessorStates.rendering) {
            // return;

            if (
                this.processor &&
                prevProps.jscadScript !== this.props.jscadScript
            ) {
                // Log debug statement
                this.log("props.jscadScript Updated");

                // Abort the current processor job and reset the jscadScript value
                this.processor.abort();
                this.processor.setJsCad(this.props.jscadScript);
            }
        }

        // @ts-ignore
        if (!this.processor) {
            // Safely pulls glOptions from this.props.viewerOptions
            const glOptions =
                this.props.viewerOptions && this.props.viewerOptions.glOptions
                    ? this.props.viewerOptions.glOptions
                    : {};

            const { viewerOptions } = this.props;

            this.processor = openScadModule(this.viewerContext.current, {
                processor: {
                    viewerContext: this.viewerContext.current,
                    viewerdiv: this.viewerDiv.current,
                    viewerCanvas: this.viewerCanvas.current,
                    parameterstable: this.parametersTable.current,
                    // debug: false,
                    // libraries: [],
                    // openJsCadPath: '',
                    // useAsync: true,
                    // useSync: true,
                    setStatus: (
                        status:
                            | ProcessorStates.rendering
                            | ProcessorStates.ready,
                        _: any,
                    ) => {
                        // Logs debug statement
                        this.log("processor.setStatus", status);

                        // Updates the internal status
                        this.setState({ status });
                    },
                    onUpdate: (data: any) => {
                        // Logs debug statement
                        console.log("processor.onUpdate", data);

                        // If data.outputFile is defined -> update state.outputFile
                        if (data.outputFile) {
                            this.setState({
                                outputFile: data.outputFile,
                            });
                        }
                    },
                },
                init: {
                    viewerContext: this.viewerContext.current,
                    viewerdiv: this.viewerDiv.current,
                    viewerCanvas: this.viewerCanvas.current,
                    parameterstable: this.parametersTable.current,
                    instantUpdate: true, // QUESTION - what does this do?
                    useAsync: true, // QUESTION - what does this do?
                },
                viewer: {
                    // TODO - tighten this up
                    axis:
                        viewerOptions && viewerOptions.axis
                            ? viewerOptions.axis
                            : undefined,
                    plate:
                        viewerOptions && viewerOptions.plate
                            ? viewerOptions.plate
                            : undefined,
                    camera:
                        viewerOptions && viewerOptions.camera
                            ? viewerOptions.camera
                            : undefined,
                    solid:
                        viewerOptions && viewerOptions.solid
                            ? viewerOptions.solid
                            : undefined,
                    glOptions: {
                        canvas: this.viewerCanvas.current,
                        ...glOptions,
                    },
                    background: {
                        // TODO - THIS DOESNT WORK, DOES IT?
                        color: { r: 1.0, g: 0.4, b: 1.0, a: 1.0 },
                    },
                },
            });

            // Ensures the dynamic import hasn't loaded yet re-renders after unmounting + mounting again
            this.setState({ loadedDynamicImport: true });
            return;
        }

        // SETS INITIAL VIEWER STATE
        if (this.state.status === "empty") {
            // this.log("LOADED INITIAL JSCAD");
            if (this.props.jscadScript) {
                this.processor.setJsCad(this.props.jscadScript);
            }
            return;
        }

        // READY FOR ANOTHER RENDER?
        if (this.state.status === "ready") {
            // this.log("READY FOR ANOTHER RENDER");

            // Only render if props.jscadScript has changed
            if (prevProps.jscadScript !== this.props.jscadScript) {
                // this.log("JSCAD SCRIPT UPDATED");
                // TODO - use abort
                // this.processor.abort();
                this.processor.setJsCad(this.props.jscadScript);
            } else if (prevState.status === "rendering") {
                // Generate the STL if the viewer is ready
                if (this.props.outputFileExport) {
                    this.processor.generateOutputFile(
                        EXPORT_FORMATS[this.props.outputFileExport],
                    );
                }
                console.log("BUILD FILE");
            }
        }
    }

    render() {
        const { style = {}, className = {} } = this.props;

        // Defines the viewerElement passed
        // Passed to props.children or rendered by itself when props.children is not defined
        const viewerElement = (
            <div className={className.wrapperDiv}>
                <table
                    className={className.parametersTable}
                    style={style.parametersTable}
                    ref={this.parametersTable}
                />

                <div
                    className={className.viewerContext}
                    style={style.viewerContext}
                    ref={this.viewerContext}
                >
                    <div
                        className={className.viewerDiv}
                        style={style.viewerDiv}
                        ref={this.viewerDiv}
                    ></div>
                </div>

                <canvas
                    className={className.viewerCanvas}
                    style={style.viewerCanvas}
                    ref={this.viewerCanvas}
                />
            </div>
        );

        return (
            <React.Fragment>
                {/* Render viewer element  */}
                {this.props.children === undefined && viewerElement}

                {/* Rener props.children */}
                {this.props.children !== undefined &&
                    this.props.children({
                        viewerElement,
                        processor: this.processor,
                        outputFile: this.state.outputFile,
                        status: this.state.status,
                        generateOutputFile: (
                            params: GenerateOutputFileParams,
                        ) => {
                            this.processor.generateOutputFile(params);
                        },
                        refs: {
                            viewerCanvas: this.viewerCanvas,
                            viewerContext: this.viewerContext,
                            viewerDiv: this.viewerDiv,
                            parametersTable: this.parametersTable,
                        },
                        resetCamera: () => {
                            if (this.processor) {
                                this.processor.resetCamera();
                            }
                        },
                    })}
            </React.Fragment>
        );
    }
}
