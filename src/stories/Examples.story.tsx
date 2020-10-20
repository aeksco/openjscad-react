import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenJSCAD } from "../OpenJSCAD";
import { DEFAULT_SCRIPT, POS_NEG_COLOR } from "./test_state";
import {
    STLA_FORMAT,
    STLB_FORMAT,
    JSCAD_FORMAT,
    JS_FORMAT,
} from "../types";

// // // //

const EXAMPLE_STYLES = {
    viewerCanvas: {
        height: "480px",
        width: "100%"
    }
}

const EXAMPLE_CLASSNAME = {
    wrapperDiv: "grid grid-cols-1 w-full"
}


storiesOf("Examples/Layouts", module)
    .add("Simple", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
            />
        );
    })
    .add("Custom", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
            >
                {(childProps) => {
                    return (
                        <div className="grid grid-cols-2 w-full">
                            <div className="px-4">
                                {/* EXAMPLE USING REFS DIRECTLY */}
                                <div ref={childProps.refs.viewerContext}>
                                    <div ref={childProps.refs.viewerDiv}></div>
                                </div>

                                {/* Don't forget parametersTable! */}
                                <table
                                    ref={childProps.refs.parametersTable}
                                ></table>

                                <canvas
                                    style={{ width: "100%", height: "480px" }}
                                    ref={childProps.refs.viewerCanvas}
                                />
                            </div>

                            <div className="px-4">
                                <button
                                    className="btn"
                                    onClick={() => {
                                        childProps.resetCamera();
                                    }}
                                >
                                    Reset Camera
                                </button>
                            </div>
                        </div>
                    );
                }}
            </OpenJSCAD>
        );
    });

// // // //

storiesOf("Examples/Camera", module)
    .add("Reset Camera", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
            >
                {(childProps) => {
                    return (
                        <div>
                            {childProps.viewerElement}

                            <button
                                className="btn mt-2"
                                onClick={() => {
                                    childProps.resetCamera();
                                }}
                            >
                                Reset Camera
                            </button>
                        </div>
                    );
                }}
            </OpenJSCAD>
        );
    })
    .add("Starting Position - Clip", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    camera: {
                        clip: { min: 1, max: 500 },
                    },
                }}
            />
        );
    })
    .add("Starting Position - Position", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    camera: {
                        position: { x: 50, y: 50, z: 250 },
                        angle: { x: -60, y: 0, z: 45 },
                    },
                }}
            />
        );
    })
    .add("Starting Position - Angle", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    camera: {
                        angle: { x: -60, y: 0, z: 45 },
                    },
                }}
            />
        );
    })
    .add("Starting Position - Field Of View", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    camera: {
                        fov: 15,
                    },
                }}
            />
        );
    });

// // // //

storiesOf("Examples/Resize Placeholder", module)
    .add("static", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                resizePlaceholder={
                    <div className="w-full min-h-full h-full bg-gray-100 flex justify-center">
                        <p className="py-56">Resizing...</p>
                    </div>
                }
            />
        );
    })
    .add("function", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                resizePlaceholder={() => {
                    const currentTime = new Date().toUTCString();
                    return (
                        <div className="w-full min-h-full h-full bg-gray-200 flex justify-center">
                            <p className="py-56 text-center">
                                Resizing...
                                <span className="block text-xs">
                                    Time: {currentTime}
                                </span>
                            </p>
                        </div>
                    );
                }}
            />
        );
    });

// // // //

storiesOf("Examples/Plate", module)
    .add("size", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    plate: {
                        size: 100,
                    },
                }}
            />
        );
    })
    .add("draw", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    plate: {
                        draw: false,
                    },
                }}
            />
        );
    })
    .add("minor grid size + color", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    plate: {
                        m: {
                            i: 5,
                            color: {
                                r: 0.8,
                                g: 0.8,
                                b: 0.8,
                                a: 1,
                            },
                        },
                    },
                }}
            />
        );
    })
    .add("major grid size + color", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    plate: {
                        M: {
                            i: 10,
                            color: {
                                r: 0.5,
                                g: 0.5,
                                b: 0.5,
                                a: 1,
                            },
                        },
                    },
                }}
            />
        );
    });

// // // //

storiesOf("Examples/Axis", module)
    .add("draw", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    axis: {
                        draw: true,
                    },
                }}
            />
        );
    })
    .add("x axis colors", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    axis: {
                        draw: true,
                        x: POS_NEG_COLOR,
                    },
                }}
            />
        );
    })
    .add("y axis colors", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    axis: {
                        draw: true,
                        y: POS_NEG_COLOR,
                    },
                }}
            />
        );
    })
    .add("z axis colors", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    axis: {
                        draw: true,
                        z: POS_NEG_COLOR,
                    },
                }}
            />
        );
    });

// // // //

storiesOf("Examples/generateOutputFile", module)
    .add("stla", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
            >
                {({ generateOutputFile, outputFile, viewerElement }) => (
                    <React.Fragment>
                        {viewerElement}
                        <button
                            className="btn"
                            onClick={() => {
                                generateOutputFile(STLA_FORMAT);
                            }}
                        >
                            Generate STL (ASCII)
                        </button>
                        <pre>{JSON.stringify({ outputFile }, null, 4)}</pre>
                    </React.Fragment>
                )}
            </OpenJSCAD>
        );
    })
    .add("stlb", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
            >
                {({ generateOutputFile, outputFile, viewerElement }) => (
                    <React.Fragment>
                        {viewerElement}
                        <button
                            className="btn"
                            onClick={() => {
                                generateOutputFile(STLB_FORMAT);
                            }}
                        >
                            Generate STL (Binary)
                        </button>
                        <pre>{JSON.stringify({ outputFile }, null, 4)}</pre>
                    </React.Fragment>
                )}
            </OpenJSCAD>
        );
    })
    .add("jscad", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
            >
                {({ generateOutputFile, outputFile, viewerElement }) => (
                    <React.Fragment>
                        {viewerElement}
                        <button
                            className="btn"
                            onClick={() => {
                                generateOutputFile(JSCAD_FORMAT);
                            }}
                        >
                            Generate JSCAD Script
                        </button>
                        <pre>{JSON.stringify({ outputFile }, null, 4)}</pre>
                    </React.Fragment>
                )}
            </OpenJSCAD>
        );
    })
    .add("js", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
            >
                {({ generateOutputFile, outputFile, viewerElement }) => (
                    <React.Fragment>
                        {viewerElement}
                        <button
                            className="btn"
                            onClick={() => {
                                generateOutputFile(JS_FORMAT);
                            }}
                        >
                            Generate JS Script
                        </button>
                        <pre>{JSON.stringify({ outputFile }, null, 4)}</pre>
                    </React.Fragment>
                )}
            </OpenJSCAD>
        );
    });
