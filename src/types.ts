import { ReactNode, RefObject } from "react";

// // // //

export interface CameraSettings {
    angle?: { x: Number; y: Number; z: Number };
    position?: { x: Number; y: Number; z: Number };
    clip?: { min: Number; max: Number };
    fov?: number;
}

// // // //

// QUESTION - change these enums to type unions?
export enum OutfileFileDescription {
    stla = "STereoLithography, ASCII",
}

// QUESTION - change these enums to type unions?
export enum OutfileFileDisplayName {
    stla = "STL (ASCII)",
}

// QUESTION - change these enums to type unions?
export enum OutfileFileName {
    stla = "stla",
    stlb = "stlb",
}

// QUESTION - change these enums to type unions?
export enum OutfileFileExtension {
    stla = "stl",
    stlb = "stl",
}

// QUESTION - change these enums to type unions?
export enum OutfileFileMimeType {
    stla = "application/sla",
    stlb = "application/sla",
}

export interface OutputFile {
    data: string;
    downloadAttribute: string;
}

export interface GenerateOutputFileParams {
    convertCAG: boolean;
    convertCSG: boolean;
    description: string;
    displayName: string;
    // description: OutfileFileDescription;
    // displayName: OutfileFileDisplayName;
    // name: OutfileFileName;
    name: string;
    // extension: OutfileFileExtension;
    extension: string;
    // mimetype: OutfileFileMimeType;
    mimetype: string;
}

// const stlbFileparams: GenerateOutputFileParams = {
//     displayName: 'STL (Binary)',
//     description: 'STereoLithography, Binary',
//     extension: 'stl',
//     mimetype: 'application/sla',
//     name: "stlb",
//     convertCSG: true,
//     convertCAG: false
// }

export type ProcessorState =
    | "empty"
    | "aborted"
    | "ready"
    | "rendering"
    | "error";

// Reference: https://github.com/jscad/OpenJSCAD.org/blob/master/packages/web/src/jscad/processor.js
export interface Processor {
    abort: () => void;
    setJsCad: (jscadScript: string) => void;
    generateOutputFile: (params: GenerateOutputFileParams) => void;
    resetCamera: () => void;
    enableItems: () => void; // * enableItems is used to send an `onUpdate` with curent information like formats and the outputFile
    // rebuildSolids: () => void; // what does this do?
    // getState: () => any; // TODO - add proper state here
    // clearOutputFile: () => void; // TODO - add proper state here
    // currentObjectsToBlob: (format: string) => void; // TODO - add proper state here - FIGURE THIS OUT
    // createControl
    // createGroupControl
    // createChoiceControl
    // createParamControls
    // formatInfo
    // clearViewer
    // updateView
    // setCurrentObjects
    // mergeSolids
    // // // // //
    // this.hasOutputFile = false;
    // this.hasError = false;
    // this.paramDefinitions = [];
    // this.paramControls = [];
    // this.script = null;
    // this.formats = formats;
    // this.baseurl = document.location.href;

    /**
     * Processor state:
     *
     * 0 - initialized - no viewer, no parameters, etc;
     * 1 - processing  - processing JSCAD script;
     * 2 - complete    - completed processing;
     * 3 - incomplete  - incompleted due to errors in processing;
     *
     * @typedef {number} ProcessorState
     */
    // /** @type {ProcessorState} state - the current processor state */
    // this.state = 0; // initialized
}

// export type HandleStyles = {
//   bottom?: React.CSSProperties;
//   bottomLeft?: React.CSSProperties;
//   bottomRight?: React.CSSProperties;
//   left?: React.CSSProperties;
//   right?: React.CSSProperties;
//   top?: React.CSSProperties;
//   topLeft?: React.CSSProperties;
//   topRight?: React.CSSProperties;
// };

// type HandleClasses = {
//   bottom?: string;
//   bottomLeft?: string;
//   bottomRight?: string;
//   left?: string;
//   right?: string;
//   top?: string;
//   topLeft?: string;
//   topRight?: string;
// }

interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface GridSettings {
    i: number;
    color: RgbaColor;
}

interface PlateSettings {
    draw?: boolean;
    size?: number;
    m?: GridSettings;
    M?: GridSettings;
}

export interface PosNegColor {
    neg: RgbaColor;
    pos: RgbaColor;
}

interface AxisSettings {
    draw?: boolean;
    x?: PosNegColor;
    y?: PosNegColor;
    z?: PosNegColor;
}

interface LightGLOptions {
    canvas: any; // TODO - change this from any Uses the HTML canvas given in 'options' or creates a new one if necessary.
    width: number;
    height: number;
    alpha: number;
}

interface JscadViewerOptions {
    plate?: PlateSettings;
    camera?: CameraSettings;
    axis?: AxisSettings;
    glOptions?: LightGLOptions;
    canvasDimensions?: {
        width: string;
        height: string;
    };
}

/**
 * ViewerChildProps
 * Props passed to the `children` function on `OpenJSCADProps`
 * @param props.viewerElement: a pre-built TSX/JSX element that may be returned inside the ReactNode returned by props.children. Useful for positioning the Viewer somewhere specific.
 * @param props.refs: (advanced usage) an object encapsulating required RefObjects that may be assigned to JSX/TSX elements returned by props.children. Note that all refs must be assigned.
 * @param props.outputFile: data used by downstream components to save exported files
 * @param props.status
 * @param props.generateOutputFile
 * @param props.processor
 * @param props.resetCamera
 */
export interface ViewerChildProps {
    viewerElement: ReactNode;
    refs: {
        viewerCanvas: RefObject<HTMLCanvasElement>;
        viewerContext: RefObject<HTMLDivElement>;
        viewerDiv: RefObject<HTMLDivElement>;
        parametersTable: RefObject<HTMLTableElement>;
    };
    generateOutputFile: (params: GenerateOutputFileParams) => void;
    outputFile: null | OutputFile;
    status: ProcessorState;
    processor: Processor;
    resetCamera: () => void;
}

/**
 * OpenJSCADProps
 * TODO - annotate this
 */
export interface OpenJSCADProps {
    jscadScript: string;
    className?: string;
    debug?: boolean;
    viewerOptions?: JscadViewerOptions;
    children?: (childProps: ViewerChildProps) => ReactNode;
}

// // // //

export enum ExportFormats {
    stla = "stla",
    stlb = "stlb",
    amf = "amf",
    x3d = "x3d",
    dxf = "dxf",
    jscad = "jscad",
    js = "js",
}

// TODO - move these into consts
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
    [ExportFormats.amf]: AMF_FORMAT,
    [ExportFormats.js]: JS_FORMAT,
    [ExportFormats.jscad]: JSCAD_FORMAT,
    [ExportFormats.stla]: STLA_FORMAT,
    [ExportFormats.stlb]: STLB_FORMAT,
    [ExportFormats.x3d]: X3D_FORMAT,
    [ExportFormats.dxf]: DXF_FORMAT,
};

// // // //
// DEFAULT VALUES FOR PROPS
// Viewer.defaults = function () {
//     return {
//       camera: {
//         fov: 45, // field of view
//         angle: { x: -60, y: 0, z: -45 }, // view angle about XYZ axis
//         position: { x: 0, y: 0, z: 100 }, // initial position at XYZ
//         clip: { min: 0.5, max: 1000 // rendering outside this range is clipped
//         } },
//       plate: {
//         draw: true, // draw or not
//         size: 200, // plate size (X and Y)
//         // minor grid settings
//         m: {
//           i: 1, // number of units between minor grid lines
//           color: { r: 0.8, g: 0.8, b: 0.8, a: 0.5 // color
//           } },
//         // major grid settings
//         M: {
//           i: 10, // number of units between major grid lines
//           color: { r: 0.5, g: 0.5, b: 0.5, a: 0.5 // color
//           } }
//       },
//       axis: {
//         draw: false, // draw or not
//         x: {
//           neg: { r: 1.0, g: 0.5, b: 0.5, a: 0.5 }, // color in negative direction
//           pos: { r: 1.0, g: 0, b: 0, a: 0.8 // color in positive direction
//           } },
//         y: {
//           neg: { r: 0.5, g: 1.0, b: 0.5, a: 0.5 }, // color in negative direction
//           pos: { r: 0, g: 1.0, b: 0, a: 0.8 // color in positive direction
//           } },
//         z: {
//           neg: { r: 0.5, g: 0.5, b: 1.0, a: 0.5 }, // color in negative direction
//           pos: { r: 0, g: 0, b: 1.0, a: 0.8 // color in positive direction
//           } }
//       },
//       solid: {
//         draw: true, // draw or not
//         lines: false, // draw outlines or not
//         faces: true,
//         overlay: false, // use overlay when drawing lines or not
//         smooth: false, // use smoothing or not
//         faceColor: { r: 1.0, g: 0.4, b: 1.0, a: 1.0 }, // default face color
//         outlineColor: { r: 0.0, g: 0.0, b: 0.0, a: 0.1 // default outline color
//         } },
//       background: {
//         color: { r: 0.93, g: 0.93, b: 0.93, a: 1.0 }
//       }
//     };
//   };
