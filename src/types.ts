import * as React from "react";

// // // //

/**
 * Defines parameters accepted by
 */
export interface CameraProps {
    /**
     * Simple angle
     */
    angle: { x: Number; y: Number; z: Number };
    /**
     * Simple position
     */
    position: { x: Number; y: Number; z: Number };
    /**
     * Simple clip
     */
    clip: { min: Number; max: Number };
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

export interface JSCADViewer {
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
