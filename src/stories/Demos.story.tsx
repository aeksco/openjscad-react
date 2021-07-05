import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenJSCAD } from "../lib/OpenJSCAD";
import * as jscad from "@jscad/modeling";
// @ts-ignore
import { serialize, mimetype } from "@jscad/stl-serializer";
import { OpenJSCADLogo, EXAMPLE_CLASSNAME, EXAMPLE_STYLES } from "./test_state";
const download = require("downloadjs");

console.log(jscad);
// @ts-ignore
const { cube, cuboid, sphere, line, cylinder } = jscad.primitives;
// @ts-ignore
const { translate, rotateX, rotateZ, center } = jscad.transforms;
// @ts-ignore
const { vectorText } = jscad.text;
// @ts-ignore
const { extrudeLinear } = jscad.extrusions;
// @ts-ignore
const { union } = jscad.booleans;
// @ts-ignore
const { expand } = jscad.expansions;
// @ts-ignore
const { poly3 } = jscad.geometries;
// @ts-ignore
const { measureBoundingBox } = poly3;

// // // //

function FormGroup(props: { label: string; children: React.ReactNode }) {
    return (
        <div className="mt-5">
            <p className="font-semibold mb-2">{props.label}</p>
            {props.children}
        </div>
    );
}

// // //

// function getSign(props: { name: string; height?: number; padding?: number }) {
//     const { name = "Hello, OpenJSCAD!" } = props;
//     console.log(jscad);
//     // const { height = 4, padding = 2 } = props;

//     // Removes all double quotes and back-slashes (prevents issues when interpolating below)
//     // name = name.replace(/[\"/s]/gi, "").replace(/[/\/s]/gi, "");

//     // Renders sign JSCAD script
//     var o: any[] = []; // our stack of objects
//     var l: any[] = []; // our stack of line segments (when rendering vector text)
//     var p: any[] = []; // our stack of extruded line segments

//     // const thickness = height;

//     // -- render name & extrude
//     // @ts-ignore
//     l = jscad.text.vectorText(name);
//     // return jscad.text.vectorText({
//     //     xOffset: 10,
//     //     yOffset: 50,
//     //     height: 18,
//     //     input: "line1\nline2",
//     // });
//     l.forEach(function(s) {
//         p.push(
//             // @ts-ignore
//             jscad.extrusions.extrudeRectangular({ size: 4, height: 4 }, s),
//         );
//     });

//     console.log("l");
//     console.log(l);
//     console.log("p");
//     console.log(p);

//     // o.push(
//     //     // booleans
//     //     //     .union(p)
//     //     // .setColor([0.3, 0.3, 0.3])
//     //     p,
//     //     // // @ts-ignore
//     //     // .scale([1 / 3, 1 / 3, 1 / 3])
//     //     // .center([true, true, false])
//     //     // .translate([0, 0, thickness]),
//     // );

//     // var b = o[0].getBounds();
//     var b = o[0];
//     // var m = padding;
//     // var w = b[1].x - b[0].x + m * 2;
//     // var h = b[1].y - b[0].y + m * 2;
//     // o.push(cube({size: [w, h, thickness], round: true, radius: 0.5}).translate([b[0].x - m, b[0].y - m, 0]).setColor([0.8, 0.8, 0.8]));

//     // console.log(o);
//     // console.log(booleans.union(o));
//     // return booleans.union(o);
//     // console.log(o);
//     // return o;
//     return p;
//     // return signJscad;
// }

// // //

// Build text by expanding the font strokes, then extruding up.
const buildFlatText = (message, extrusionHeight, characterLineWidth) => {
    if (message === undefined || message.length === 0) return [];
    const lineSegments3D = [];
    const lineSegmentPointArrays = vectorText({ x: 0, y: 0, input: message }); // line segments for each character
    lineSegmentPointArrays.forEach(segmentPoints => {
        // process the line segment
        const segmentShape = extrudeLinear(
            { height: extrusionHeight },
            expand(
                { delta: characterLineWidth, corners: "round", segments: 16 },
                line(segmentPoints),
            ),
        );
        // @ts-ignore
        lineSegments3D.push(segmentShape);
    });

    const messageObject = center([true, true, false], union(lineSegments3D));
    const textObject = translate([0, extrusionHeight, 0], messageObject);
    return union(
        textObject,
        // TODO - add base here under extruded text
        // cuboid({ center: [0, 0, 0], size: [20, 5, extrusionHeight] }),
    );
};

// // //

storiesOf("Demos", module).add("Name Plate", () => {
    const DEFAULT_NAME = "Hello, OpenJSCAD!";
    const [name, setName] = React.useState<string>(DEFAULT_NAME);
    const [height, setHeight] = React.useState<number>(4);
    const [padding, setPadding] = React.useState<number>(6);
    const solids = [buildFlatText(name, height, 2)];

    return (
        <div className="card">
            <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
                <div className="lg:pr-2 pl-0 flex flex-col justify-between col-span-2 lg:col-span-1">
                    <div>
                        <h2 className="text-center text-xl mb-3">
                            Customize 3D Model
                        </h2>
                        <hr />

                        <FormGroup label="Text">
                            <input
                                className="bg-white shadow rounded p-3 w-full border border-gray-200"
                                placeholder="Enter a name"
                                value={name}
                                onChange={e => {
                                    const updatedName = e.currentTarget.value;
                                    setName(updatedName);
                                }}
                            />
                        </FormGroup>

                        <FormGroup label="Height">
                            <input
                                type="range"
                                className="focus:outline-none rounded-xl overflow-hidden appearance-none bg-gray-400 h-5 w-full"
                                step={1}
                                min={2}
                                max={15}
                                value={height}
                                onChange={e => {
                                    const updatedHeight = Number(
                                        e.currentTarget.value,
                                    );
                                    setHeight(updatedHeight);
                                }}
                            />
                        </FormGroup>

                        <FormGroup label="Padding">
                            <input
                                type="range"
                                className="focus:outline-none rounded-xl overflow-hidden appearance-none bg-gray-400 h-5 w-full"
                                step={1}
                                min={0}
                                max={15}
                                value={padding}
                                onChange={e => {
                                    const updatedPadding = Number(
                                        e.currentTarget.value,
                                    );
                                    setPadding(updatedPadding);
                                }}
                            />
                        </FormGroup>
                    </div>
                    <button
                        className="btn w-full flex justify-center text-center mt-3"
                        onClick={() => {
                            const stl = serialize({ binary: true }, ...solids);
                            const blob = new Blob(stl);
                            download(blob, "test.stl", mimetype);
                        }}
                    >
                        Download
                    </button>
                </div>

                <div className="col-span-2 lg:pl-2 sm:pl-0 mt-3 lg:mt-0 rounded-xl">
                    <OpenJSCAD
                        style={EXAMPLE_STYLES}
                        className={EXAMPLE_CLASSNAME}
                        solids={solids}
                    />
                </div>
            </div>
        </div>
    );
});

// // // // /

storiesOf("Demos", module).add("OpenJSCADLogo", () => {
    return (
        <div className="grid grid-cols-1 mt-5">
            <OpenJSCAD solids={OpenJSCADLogo()} />
        </div>
    );
});
