import React from "react";
import {
    ProcessorState,
    ProcessorStates,
    OutputFile,
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
    initializedProcessor: boolean;
    status: ProcessorState;
    outputFile: null | OutputFile;
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
            initializedProcessor: false,
            status: ProcessorStates.empty,
            outputFile: null,
        };
    }

    log(message: any, ...optionalParams: any[]) {
        if (this.props.debug) {
            console.log(message, ...optionalParams);
        }
    }

    componentDidUpdate(prevProps: OpenJSCADProps, prevState: OpenJSCADState) {
        // Short-circuit if we have not loaded the dynamic import yet
        if (!openScadModule) {
            // Logs debug message
            this.log("NO MODULE?");

            // Short-circuit remaining function execution
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

        // If this.processor is null -> initialize processor
        if (!this.processor) {
            // Pulls viewerOptions from props
            const { viewerOptions = {} } = this.props;

            // Safely pulls glOptions from viewerOptions
            const glOptions = viewerOptions.glOptions
                ? viewerOptions.glOptions
                : {};

            // Assigns this.processor
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
                        this.log("processor.onUpdate", data);

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
                    axis: viewerOptions.axis ? viewerOptions.axis : undefined,
                    plate: viewerOptions.plate
                        ? viewerOptions.plate
                        : undefined,
                    camera: viewerOptions.camera
                        ? viewerOptions.camera
                        : undefined,
                    solid: viewerOptions.solid
                        ? viewerOptions.solid
                        : undefined,
                    glOptions: {
                        canvas: this.viewerCanvas.current,
                        ...glOptions,
                    },
                    background: {
                        // NOTE - THIS DOESNT WORK. It should, but it doesn't. Definitely a problem with OpenJSCAD.
                        color: { r: 1.0, g: 0.4, b: 1.0, a: 1.0 },
                    },
                },
            });

            // Triggers re-render after processor has been initialized
            this.setState({ initializedProcessor: true });

            // Short-circuit remaining function execution
            return;
        }

        // Sets initial viewer state
        if (this.state.status === "empty") {
            // Logs debug message
            this.log("empty");

            // Loads script and logs debug message
            if (this.props.jscadScript) {
                this.log("loading initial script");
                this.processor.setJsCad(this.props.jscadScript);
            }

            // Short-circuit remaining function execution
            return;
        }

        // Ready for another render
        if (this.state.status === "ready") {
            // Logs debug message
            this.log("ready");

            // Only render if props.jscadScript has changed
            if (prevProps.jscadScript !== this.props.jscadScript) {
                // Logs debug message
                this.log("props.jscadScriptUpdated");

                // Updates with latest jscadScript
                this.processor.setJsCad(this.props.jscadScript);
            } else if (prevState.status === "rendering") {
                // Logs debug message
                this.log("Rendering script");

                // Generate the STL if the viewer is ready
                if (this.props.outputFileExport) {
                    this.processor.generateOutputFile(
                        EXPORT_FORMATS[this.props.outputFileExport],
                    );
                }
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
                    })}
            </React.Fragment>
        );
    }
}
