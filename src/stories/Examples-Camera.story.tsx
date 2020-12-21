import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenJSCAD } from "../lib/OpenJSCAD";
import {
    DEFAULT_SCRIPT,
    EXAMPLE_STYLES,
    EXAMPLE_CLASSNAME,
} from "./test_state";

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
                                    childProps.processor.resetCamera();
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
