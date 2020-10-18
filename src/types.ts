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
}

// QUESTION - change these enums to type unions?
export enum OutfileFileExtension {
    stla = "stl",
}

// QUESTION - change these enums to type unions?
export enum OutfileFileMimeType {
    stla = "application/sla",
}

export interface GenerateOutputFileParams {
    convertCAG: boolean;
    convertCSG: boolean;
    description: OutfileFileDescription;
    displayName: OutfileFileDisplayName;
    name: OutfileFileName;
    extension: OutfileFileExtension;
    mimetype: OutfileFileMimeType;
}

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

// resizeHandleWrapperClass ?: string;
// resizeHandleWrapperStyle ?: Style;

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
    draw: boolean;
    size: number;
    m: GridSettings;
    M: GridSettings;
}

interface PosNegColor {
    neg: RgbaColor;
    pos: RgbaColor;
}

interface AxisSettings {
    draw: boolean;
    x: PosNegColor;
    y: PosNegColor;
    z: PosNegColor;
}

interface LightGLOptions {
    canvas: any; // Uses the HTML canvas given in 'options' or creates a new one if necessary.
    width: number;
    height: number;
    alpha: number;
}

interface JscadViewerOptions {
    plate: PlateSettings;
    camera: CameraSettings;
    axis: AxisSettings;
    glOptions: LightGLOptions;
    processor: Object;
}

interface ProcessorOptions {
    viewerContext: any; // TODO - replace with ref
    viewerdiv: any; // TODO - replace with ref
    parameterstable: any; // TODO - replace with ref
    viewerCanvas: any; // TODO - replace with ref
}
