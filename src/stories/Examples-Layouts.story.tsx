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

storiesOf("Examples/Layouts", module)
    .add("Simple", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                solids={DEFAULT_SCRIPT}
            />
        );
    })
    .add("Custom", () => {
        return (
            <OpenJSCAD
                className={EXAMPLE_CLASSNAME}
                style={EXAMPLE_STYLES}
                solids={DEFAULT_SCRIPT}
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
                                            childProps.processor.resetCamera();
                                        }}
                                    >
                                        Reset Camera
                                    </button>

                                    <p>{childProps.status}</p>

                                    <button
                                        onClick={() => {
                                            childProps.processor.rebuildSolids();
                                        }}
                                    >
                                        rebuildSolids
                                    </button>

                                    <button
                                        onClick={() => {
                                            childProps.processor.abort();
                                        }}
                                    >
                                        abort
                                    </button>

                                    <button
                                        onClick={() => {
                                            childProps.processor.clearOutputFile();
                                        }}
                                    >
                                        clearOutputFile
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </OpenJSCAD>
        );
    });
