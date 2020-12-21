import { ReactNode, RefObject } from "react";
import { WindowResizeObserverProps } from "./WindowResizeObserver";

// // // //

/**
 * The available values accepted by GenerateOutputFileParams.mimetype
 */
export type OutfileFileMimeType =
    | "application/sla"
    | "application/amf+xml"
    | "model/x3d+xml"
    | "application/dxf"
    | "application/javascript";

/**
 * Enum of values for each OutfileFileMimeType
 * @see OutfileFileMimeType
 */
export enum OutfileFileMimeTypes {
    stla = "application/sla",
    stlb = "application/sla",
    amf = "application/amf+xml",
    x3d = "model/x3d+xml",
    dxf = "application/dxf",
    jscad = "application/javascript",
    js = "application/javascript",
}

/**
 * The available values for OpenJSCADProps.outputFileExport
 * Determines which file type, if any, should be used for the default 3D file export
 */
export type ExportFormat =
    | "stla"
    | "stlb"
    | "amf"
    | "x3d"
    | "dxf"
    | "jscad"
    | "js";

/**
 * An enum of values for each `ExportFormat`
 * @see ExportFormat
 */
export enum ExportFormats {
    stla = "stla",
    stlb = "stlb",
    amf = "amf",
    x3d = "x3d",
    dxf = "dxf",
    jscad = "jscad",
    js = "js",
}

/**
 * Describes an XYZ coordinate for `CameraSettings`
 * @param x - the X position
 * @param y - the Y position
 * @param z - the Z position
 * @see CameraSettings
 */
interface XYZCoord {
    x: number;
    y: number;
    z: number;
}

/**
 * A minimum and maximum value pair used for `CameraSettings.clip`
 * @see CameraSettings.clip
 */
interface MinMax {
    min: number;
    max: number;
}

/**
 * Values passed in for OpenJSCADProps.viewerOptions.camera
 * @param angle - Determines the angle of the camera
 * @param position - Determines the initial position of the camera
 * @param clip - Rendering outside this range is clipped (default value: `{ min: 1, max: 1000 }`)
 * @param fov - The field of view of the camera (default value: 45)
 */
export interface CameraSettings {
    angle?: XYZCoord;
    position?: XYZCoord;
    clip?: MinMax;
    fov?: number;
}

/**
 * The data and used by your React app to download the file exported by the OpenJSCADProcessor
 */
export interface OutputFile {
    data: string;
    downloadAttribute: string;
}

/**
 * Required params for OpenJSCADProcessor.generateOutputFile
 * @param convertCAG - QUESTION - what is this? Can't find info in documentation...
 * @param convertCSG - QUESTION - what is this? Can't find info in documentation...
 * @param description - the description of the format being exported
 * @param displayName - the display name of the format being exported
 * @param name - the name of the type of file being exported (see `EXPORT_FORMATS`)
 * @param extension - the extension used by the exported file
 * @param mimetype - the mimetype of the file being exported (see `OutfileFileMimeType`)
 */
export interface GenerateOutputFileParams {
    convertCAG: boolean;
    convertCSG: boolean;
    description: string;
    displayName: string;
    name: string;
    extension: string;
    mimetype: OutfileFileMimeType;
}

/**
 * Available values assigned to OpenJSCADProcessor.state
 */
export type ProcessorState =
    | "empty"
    | "aborted"
    | "ready"
    | "rendering"
    | "error";

/**
 * Enum of values in `ProcessorState`
 * @see ProcessorState
 */
export enum ProcessorStates {
    empty = "empty",
    aborted = "aborted",
    ready = "ready",
    rendering = "rendering",
    error = "error",
}

/**
 * Defines the methods exposed by the OpenJSCAD Processor
 *
 * [API Reference](https://github.com/jscad/OpenJSCAD.org/blob/master/packages/web/src/jscad/processor.js)
 * @param abort - aborts the if state is processing
 * @param setJsCad - sets the JSCAD script rendered by the processor
 * @param generateOutputFile - generates a output file. Read the resulting OutputFile in the `onUpdate` hook.
 * @param resetCamera - resets the current camera position to the initial value passed in with JscadViewerOptions.camera
 * @param enableItems - used to send an `onUpdate` with curent information (like formats and the outputFile)
 * @param rebuildSolids - evaluate script & rebuild solids in main thread
 * @param clearOutputFile - clears the Processor's outputFile state (but not the outputFile state in the OpenJSCADProcessor component)
 */
export interface Processor {
    abort: () => void;
    setJsCad: (jscadScript: string) => void;
    generateOutputFile: (params: GenerateOutputFileParams) => void;
    resetCamera: () => void;
    enableItems: () => void;
    rebuildSolids: () => void;
    clearOutputFile: () => void;
}

/**
 * Describes a single RGBA color
 * @param r - red (values 0.0 - 1.0)
 * @param g - green (values 0.0 - 1.0)
 * @param b - blue (values 0.0 - 1.0)
 * @param a - alpha (values 0.0 - 1.0)
 */
interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

/**
 * Describes the major and minor grids on PlateSettings
 * @param i - number of units between grid lines
 * @param color - color of the grid - see `RgbaColor`
 */
interface GridSettings {
    i: number;
    color: RgbaColor;
}

/**
 * Describes the settings for the plate rendered by the OpenJSCADProcessor
 * @param draw - whether or not to draw the plate
 * @param size - size of the plate.
 * @param m - settings for the minor grid on the plate. See `GridSettings`
 * @param M - settings for the major grid on the plate. See `GridSettings`
 */
interface PlateSettings {
    draw?: boolean;
    size?: number;
    m?: GridSettings;
    M?: GridSettings;
}

/**
 * Positive + negative color settings for each axis
 * @param neg - color in negative direction
 * @param pos - plate size (X and Y)
 */
export interface PosNegColor {
    neg: RgbaColor;
    pos: RgbaColor;
}

/**
 * Describes the settings for the OpenJSCAD renderer
 * @param draw - whether or not to draw the axis
 * @param x - colors for x axis
 * @param y - colors for y axis
 * @param z - colors for z axis
 */
interface AxisSettings {
    draw?: boolean;
    x?: PosNegColor;
    y?: PosNegColor;
    z?: PosNegColor;
}

/**
 * Describes renderer options for OpenJSCAD
 * @param canvas - The HTML canvas element used to render the OpenJSCAD script
 * @param width - width applied to the canvas created when `options.canvas` is not set
 * @param height - height applied to the canvas created when `options.canvas` is not set
 * @param alpha - The alpha channel is disabled by default because it usually causes unintended transparencies in the canvas
 */
interface LightGLOptions {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    alpha: number;
}

/**
 * Describes renderer options for OpenJSCAD solids
 * @param draw - Whether or not to draw the solids. (default value: `true`)
 * @param lines - Whether or not to render lines on the solid. (default value: `false`)
 * @param faces - Whether or not to draw faces on the solids. (default value: `true`)
 * @param overlay - Whether or not to use overlay when drawing lines or not. (default value: `false`)
 * @param smooth - Whether or not to apply smoothing to the solids. (default value: `false`)
 * @param faceColor - Color of the solid faces. See `RgbaColor`. (default value: `{ r: 1.0, g: 0.4, b: 1.0, a: 1.0 }`)
 * @param outlineColor - Color of the solid outlines. (default value: { r: 0.0, g: 0.0, b: 0.0, a: 0.1 })
 */
interface SolidOptions {
    draw?: boolean;
    lines?: boolean;
    faces?: boolean;
    overlay?: boolean;
    smooth?: boolean;
    faceColor?: RgbaColor;
    outlineColor?: RgbaColor;
}

/**
 * Options for OpenJSCADProps.viewerOptions
 * @param plate - see `PlateSettings`
 * @param camera - see `CameraSettings`
 * @param axis - see `AxisSettings`
 * @param glOptions - see `LightGLOptions`
 * @param solid - see `SolidOptions`
 */
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
 * @param viewerElement - a pre-built TSX/JSX element that may be returned inside the ReactNode returned by props.children. Useful for positioning the Viewer somewhere specific.
 * @param refs - (advanced usage) an object encapsulating required RefObjects that may be assigned to JSX/TSX elements returned by props.children. Note that all refs must be assigned.
 * @param generateOutputFile - generates a output file. Read the resulting OutputFile in the `onUpdate` hook.
 * @param outputFile - data used by downstream components to save exported files
 * @param status - the current state of the processor. See `ProcessorState`
 * @param processor - The OpenJSCAD processor interface. See `Processor`
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
}

/**
 * Props for the OpenJSCADProcessor component
 * @param jscadScript - the stringified OpenJSCAD script to render in the processor
 * @param debug - optional debug logs for OpenJSCADProcessor
 * @param outputFileExport - optional default ExportFormat. When this is included, the OpenJSCADProcessor component will always re-generate the export when a change to `props.jscadScript` is detected.
 * @param viewerOptions - optional parameters to configure the Viewer component
 * @param children - optional render prop that accepts `ViewerChildProps` and returns `React.ReactNode`
 * @param style - optional object of React.CSSProperties to apply to the TSX rendered by the processor
 * @param className - optional object of className properties to apply to the TSX rendered by the processor
 */
export interface OpenJSCADProcessorProps {
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

export type OpenJSCADProps = OpenJSCADProcessorProps &
    WindowResizeObserverProps & { debounceTimeout?: number };
