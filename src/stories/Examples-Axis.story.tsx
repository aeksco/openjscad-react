import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenJSCAD } from "../lib/OpenJSCAD";
import {
    DEFAULT_SCRIPT,
    POS_NEG_COLOR,
    EXAMPLE_STYLES,
    EXAMPLE_CLASSNAME,
} from "./test_state";

// // // //

storiesOf("Examples/Axis", module)
    .add("draw", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
