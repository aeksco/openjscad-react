import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenJSCAD } from "../lib/OpenJSCAD";
import {
    DEFAULT_SCRIPT,
    EXAMPLE_STYLES,
    EXAMPLE_CLASSNAME,
} from "./test_state";
import {
    STLA_FORMAT,
    STLB_FORMAT,
    JSCAD_FORMAT,
    JS_FORMAT,
    EXPORT_FORMATS,
} from "../lib/constants";
import { ExportFormats } from "../lib/types";

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
