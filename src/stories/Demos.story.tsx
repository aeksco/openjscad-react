import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenJSCAD } from "../lib/OpenJSCAD";

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

storiesOf("Demos/Simple", module).add("Name Plate", () => {
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
                            <div className="lg:pr-2 pl-0 flex flex-col justify-between col-span-2 lg:col-span-1">
                                <div>
                                    <h2 className="text-center text-xl mb-3">
                                        Customize &amp; 3D Print
                                    </h2>
                                    <hr />

                                    <div className="mt-5">
                                        <p>Text</p>
                                        <input
                                            className="bg-purple-white shadow rounded border-0 p-3 w-full"
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

                            <div className="col-span-2 lg:pl-2 sm:pl-0 mt-3 lg:mt-0 rounded-xl">
                                {/* EXAMPLE USING REFS DIRECTLY */}
                                <div
                                    ref={childProps.refs.viewerContext}
                                    className="rounded-xl bg-white overflow-hidden"
                                >
                                    <div ref={childProps.refs.viewerDiv} />
                                </div>

                                {/* Don't forget parametersTable! */}
                                <table ref={childProps.refs.parametersTable} />

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
