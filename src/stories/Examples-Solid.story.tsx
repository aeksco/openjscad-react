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

storiesOf("Examples/solid", module)
    .add("draw", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
                viewerOptions={{
                    solid: {
                        outlineColor: { r: 0.2, g: 0.4, b: 0.6, a: 1.0 },
                    },
                }}
            />
        );
    });
