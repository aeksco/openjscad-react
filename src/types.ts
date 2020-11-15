import { ReactNode, RefObject } from "react";

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

type ExportFormat = "stla" | "stlb" | "amf" | "x3d" | "dxf" | "jscad" | "js";

export interface CameraSettings {
    angle?: { x: Number; y: Number; z: Number };
    position?: { x: Number; y: Number; z: Number };
    clip?: { min: Number; max: Number };
    fov?: number;
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

export enum ProcessorStates {
    empty = "empty",
    aborted = "aborted",
    ready = "ready",
    rendering = "rendering",
    error = "error",
}

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

interface SolidOptions {
    draw?: boolean; // draw or not - default = true
    lines?: boolean; // draw outlines or not - default = false
    faces?: boolean; // draw faces or not - default = true,
    overlay?: boolean; // use overlay when drawing lines or not = default = false
    smooth?: boolean; // use smoothing or not = default = false
    faceColor?: RgbaColor; // default face color - default = { r: 1.0, g: 0.4, b: 1.0, a: 1.0 }
    outlineColor?: RgbaColor; // default outline color - default = { r: 0.0, g: 0.0, b: 0.0, a: 0.1 }
}

interface JscadViewerOptions {
    plate?: PlateSettings;
    camera?: CameraSettings;
    axis?: AxisSettings;
    glOptions?: LightGLOptions;
    solid?: SolidOptions;
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
    debug?: boolean;
    outputFileExport?: ExportFormat | ExportFormats;
    viewerOptions?: JscadViewerOptions;
    children?: (childProps: ViewerChildProps) => ReactNode;
    style?: {
        wrapperDiv?: React.CSSProperties;
        viewerCanvas?: React.CSSProperties;
        viewerContext?: React.CSSProperties;
        viewerDiv?: React.CSSProperties;
        parametersTable?: React.CSSProperties;
    };
    className?: {
        wrapperDiv?: string;
        viewerCanvas?: string;
        viewerContext?: string;
        viewerDiv?: string;
        parametersTable?: string;
    };
}
