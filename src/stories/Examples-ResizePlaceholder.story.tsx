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

storiesOf("Examples/Resize Placeholder", module)
    .add("static", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                solids={DEFAULT_SCRIPT}
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
                solids={DEFAULT_SCRIPT}
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
