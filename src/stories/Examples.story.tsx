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
    EXPORT_FORMATS,
} from "../constants";
import { ExportFormats } from "../types";

// // // //

const EXAMPLE_STYLES = {
    viewerCanvas: {
        height: "480px",
        width: "100%",
    },
};

const EXAMPLE_CLASSNAME = {
    wrapperDiv: "grid grid-cols-1 w-full",
};

// // // //

function getNamePlate(props: { name?: string; height?: number }) {
    const { name = "Hello, OpenJSCAD!", height = 4 } = props;
    const namePlateJSCAD: string = `
function main (param) {
    var o = []; // our stack of objects
    var l = []; // our stack of line segments (when rendering vector text)
    var p = []; // our stack of extruded line segments

    var name = "${name}";
    var thickness = ${String(height)};
    
    // -- render name & extrude
    l = vector_text(0, 0, name);
    l.forEach(function (s) {
        p.push(rectangular_extrude(s, {w: 4, h: 4}));
    });
    o.push(union(p).setColor([0.3, 0.3, 0.3]).scale([1 / 3, 1 / 3, 1 / 3]).center([true, true, false]).translate([0, 0, thickness]));
    
    var b = o[0].getBounds();
    var m = 2;
    var w = b[1].x - b[0].x + m * 2;
    var h = b[1].y - b[0].y + m * 2;
    o.push(cube({size: [w, h, thickness], round: true, radius: 0.5}).translate([b[0].x - m, b[0].y - m, 0]).setColor([0.8, 0.8, 0.8]));
    
    return union(o);
    }
`;

    return namePlateJSCAD;
}

// // // //

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
                        <div className="card">
                            <div className="grid grid-cols-3 w-full">
                                <div className="pr-4">
                                    <p className="">Custom Layout</p>
                                </div>

                                <div className="pl-4 col-span-2">
                                    {/* EXAMPLE USING REFS DIRECTLY */}
                                    <div ref={childProps.refs.viewerContext}>
                                        <div ref={childProps.refs.viewerDiv} />
                                    </div>

                                    {/* Don't forget parametersTable! */}
                                    <table
                                        ref={childProps.refs.parametersTable}
                                    />

                                    <canvas
                                        style={{
                                            width: "100%",
                                            height: "480px",
                                        }}
                                        ref={childProps.refs.viewerCanvas}
                                    />
                                    <button
                                        className="btn w-full mt-2"
                                        onClick={() => {
                                            childProps.resetCamera();
                                        }}
                                    >
                                        Reset Camera
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </OpenJSCAD>
        );
    })
    .add("complete", () => {
        const DEFAULT_NAME = "Hello, OpenJSCAD!";
        const [name, setName] = React.useState<string>(DEFAULT_NAME);
        const [height, setHeight] = React.useState<number>(4);

        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                outputFileExport="stla"
                viewerOptions={{
                    camera: {
                        angle: { x: -30, y: 0, z: 0 },
                    },
                }}
                jscadScript={getNamePlate({
                    name,
                    height,
                })}
                loadingPlaceholder={() => {
                    return (
                        <div
                            className="card flex justify-center items-center"
                            style={{ minHeight: "32rem" }}
                        >
                            <p>Resizing...</p>
                        </div>
                    );
                }}
            >
                {(childProps) => {
                    return (
                        <div className="card">
                            <div className="grid grid-cols-3 w-full">
                                <div className="pr-2 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-center text-xl mb-3">
                                            Customize &amp; 3D Print
                                        </h2>
                                        <hr />

                                        <div className="mt-5">
                                            <p>Text</p>
                                            <input
                                                class="bg-purple-white shadow rounded border-0 p-3 w-full"
                                                placeholder="Enter a name"
                                                value={name}
                                                onChange={(e) => {
                                                    const updatedName =
                                                        e.currentTarget.value;
                                                    setName(updatedName);
                                                }}
                                            />
                                        </div>

                                        <div className="mt-8">
                                            <p>Height</p>
                                            <input
                                                type="range"
                                                className="focus:outline-none rounded-xl overflow-hidden appearance-none bg-gray-400 h-3 w-full"
                                                step={1}
                                                min={2}
                                                max={15}
                                                value={height}
                                                onChange={(e) => {
                                                    const updatedHeight = Number(
                                                        e.currentTarget.value,
                                                    );
                                                    setHeight(updatedHeight);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {childProps.outputFile === null ||
                                        (childProps.status === "rendering" && (
                                            <button
                                                className="btn w-full flex justify-center text-center mt-3"
                                                disabled
                                            >
                                                Download and 3D Print
                                            </button>
                                        ))}

                                    {childProps.outputFile !== null && (
                                        <a
                                            className="btn w-full flex justify-center text-center mt-3"
                                            download="openjscad-react-export.stl"
                                            href={childProps.outputFile.data}
                                        >
                                            Download and 3D Print
                                        </a>
                                    )}
                                </div>

                                <div className="pl-2 col-span-2">
                                    {/* EXAMPLE USING REFS DIRECTLY */}
                                    <div
                                        ref={childProps.refs.viewerContext}
                                        className="rounded-xl bg-white overflow-hidden"
                                    >
                                        <div ref={childProps.refs.viewerDiv} />
                                    </div>

                                    {/* Don't forget parametersTable! */}
                                    <table
                                        ref={childProps.refs.parametersTable}
                                    />

                                    <canvas
                                        style={{
                                            width: "100%",
                                            height: "480px",
                                        }}
                                        ref={childProps.refs.viewerCanvas}
                                    />
                                </div>
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
                loadingPlaceholder={
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
                loadingPlaceholder={() => {
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
                            className="btn mt-2"
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
                            className="btn mt-2"
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
                            className="btn mt-2"
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
                            className="btn mt-2"
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

// // // //

storiesOf("Examples/solid", module)
    .add("draw", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    solid: {
                        draw: false,
                    },
                }}
            />
        );
    })
    .add("lines", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    solid: {
                        lines: true,
                    },
                }}
            />
        );
    })
    .add("faces", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    solid: {
                        faces: false,
                    },
                }}
            />
        );
    })
    .add("overlay", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    solid: {
                        overlay: true,
                    },
                }}
            />
        );
    })
    .add("smooth", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    solid: {
                        smooth: true,
                    },
                }}
            />
        );
    })
    .add("faceColor", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    solid: {
                        faceColor: { r: 0.2, g: 0.4, b: 0.6, a: 1.0 },
                    },
                }}
            />
        );
    })
    .add("outlineColor", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                viewerOptions={{
                    solid: {
                        outlineColor: { r: 0.2, g: 0.4, b: 0.6, a: 1.0 },
                    },
                }}
            />
        );
    });

// // // //

const outputFileStories = storiesOf("Examples/outputFileExport", module);

const outputFileFormats: ExportFormats[] = [
    ExportFormats.stla,
    ExportFormats.stlb,
    ExportFormats.amf,
    ExportFormats.x3d,
    ExportFormats.dxf,
    ExportFormats.jscad,
    ExportFormats.js,
];

outputFileFormats.forEach((format) => {
    outputFileStories.add(format, () => {
        // Pulls metadata for export (file extension)
        const formatMetadata = EXPORT_FORMATS[format];

        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                jscadScript={DEFAULT_SCRIPT}
                outputFileExport={format}
            >
                {({ viewerElement, outputFile }) => (
                    <div>
                        {viewerElement}
                        <br />
                        {outputFile !== null && (
                            <a
                                className="btn mt-2"
                                download={`${formatMetadata.name}-export.${formatMetadata.extension}`}
                                href={outputFile.data}
                            >
                                Download {formatMetadata.displayName}
                            </a>
                        )}
                    </div>
                )}
            </OpenJSCAD>
        );
    });
});
