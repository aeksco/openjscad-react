import { GenerateOutputFileParams, ExportFormats } from "./types";

// // // //

export const STLA_FORMAT: GenerateOutputFileParams = {
    name: "stla",
    displayName: "STL (ASCII)",
    description: "STereoLithography, ASCII",
    extension: "stl",
    mimetype: "application/sla",
    convertCSG: true,
    convertCAG: false,
};

export const STLB_FORMAT: GenerateOutputFileParams = {
    name: "stlb",
    displayName: "STL (Binary)",
    description: "STereoLithography, Binary",
    extension: "stl",
    mimetype: "application/sla",
    convertCSG: true,
    convertCAG: false,
};

export const AMF_FORMAT: GenerateOutputFileParams = {
    name: "amf",
    displayName: "AMF (experimental)",
    description: "Additive Manufacturing File Format",
    extension: "amf",
    mimetype: "application/amf+xml",
    convertCSG: true,
    convertCAG: false,
};

export const X3D_FORMAT: GenerateOutputFileParams = {
    name: "x3d",
    displayName: "X3D",
    description: "X3D File Format",
    extension: "x3d",
    mimetype: "model/x3d+xml",
    convertCSG: true,
    convertCAG: false,
};

export const DXF_FORMAT: GenerateOutputFileParams = {
    name: "dxf",
    displayName: "DXF",
    description: "AutoCAD Drawing Exchange Format",
    extension: "dxf",
    mimetype: "application/dxf",
    convertCSG: true,
    convertCAG: true,
};

export const JSCAD_FORMAT: GenerateOutputFileParams = {
    name: "jscad",
    displayName: "JSCAD",
    description: "OpenJSCAD.org Source",
    extension: "jscad",
    mimetype: "application/javascript",
    convertCSG: true,
    convertCAG: true,
};

export const JS_FORMAT: GenerateOutputFileParams = {
    name: "js",
    displayName: "js",
    description: "JavaScript Source",
    extension: "js",
    mimetype: "application/javascript",
    convertCSG: true,
    convertCAG: true,
};

export const EXPORT_FORMATS: {
    [key in ExportFormats]: GenerateOutputFileParams;
} = {
    amf: AMF_FORMAT,
    js: JS_FORMAT,
    jscad: JSCAD_FORMAT,
    stla: STLA_FORMAT,
    stlb: STLB_FORMAT,
    x3d: X3D_FORMAT,
    dxf: DXF_FORMAT,
};
