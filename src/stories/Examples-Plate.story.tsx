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

storiesOf("Examples/Plate", module)
    .add("size", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
