import * as React from "react";

// // // //

export interface CameraProps {
  angle: { x: Number; y: Number; z: Number };
  position: { x: Number; y: Number; z: Number };
  clip: { min: Number; max: Number };
}

// // // //

export enum OutfileFileDescription {
  stla = "STereoLithography, ASCII"
}

export enum OutfileFileDisplayName {
  stla = "STL (ASCII)"
}

export enum OutfileFileName {
  stla = "stla"
}

export enum OutfileFileExtension {
  stla = "stl"
}

export enum OutfileFileMimeType {
  stla = "application/sla"
}

interface GenerateOutputFileParams {
  convertCAG: boolean;
  convertCSG: boolean;
  description: OutfileFileDescription;
  displayName: OutfileFileDisplayName;
  name: OutfileFileName;
  extension: OutfileFileExtension;
  mimetype: OutfileFileMimeType;
}

interface JSCADViewer {
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

/**
 * @param jscadScript - this is the value for the script
 */
interface ViewerProps {
  /**
  The display content of the button
  */
  jscadScript: string;
  /**
   * Simple click handler
   */
  className?: string;
  camera?: CameraProps;
  children?: (childProps: {
    viewer: React.ReactNode;
    refs: {
      [key: string]: React.RefObject<any>;
    };
    outputFile: any; // TODO - get beter type for this
    status: "empty" | "aborted" | "ready" | "rendering"; // TODO - get beter type for this
    resetCamera: () => void;
  }) => React.ReactNode;
}

interface ViewerState {
  loadedDynamicImport: boolean;
  status: "empty" | "ready" | "rendering" | "aborted";
  outputFile: any;
  // TODO - add camera
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

/**
 * Defines class-component for Openjscad viewer
 */
export class OpenjscadViewer extends React.Component<ViewerProps, ViewerState> {
  viewerContext: React.RefObject<any>;
  viewerDiv: React.RefObject<any>;
  viewerCanvas: React.RefObject<any>;
  parameterstable: React.RefObject<any>;
  _jscadViewer: null | JSCADViewer;

  openScadModule: any;
  constructor(props: ViewerProps) {
    super(props);

    this.openScadModule = null;
    this.viewerContext = React.createRef();
    this.viewerDiv = React.createRef();
    this.viewerCanvas = React.createRef();
    this.parameterstable = React.createRef();
    this._jscadViewer = null;

    this.state = {
      loadedDynamicImport: false,
      status: "empty",
      outputFile: null
    };
  }

  componentDidMount() {
    if (this.openScadModule) {
      this.setState({ loadedDynamicImport: true });
    }

    // @ts-ignore
    import("@jscad/web").then(module => {
      // Set openjscad module
      this.openScadModule = module.default;

      // Set state.ready to true
      this.setState({ loadedDynamicImport: true });
    });
  }

  componentDidUpdate(prevProps: ViewerProps, prevState: ViewerState) {
    // Short-circuit if we have not loaded the dynamic import yet
    if (!this.openScadModule) {
      return;
    }
    if (!this.state.loadedDynamicImport) {
      return;
    }

    if (!this.viewerCanvas.current) {
      console.log("NO VIEWER CANVAS PRESENT");
      return;
    }

    // Short-circuit function if current state is rendering
    if (this.state.status === "rendering") {
      // return;

      if (
        this._jscadViewer &&
        prevProps.jscadScript !== this.props.jscadScript
      ) {
        // console.log("JSCAD SCRIPT UPDATED");
        // TODO - use abort
        this._jscadViewer.abort();
        this._jscadViewer.setJsCad(this.props.jscadScript);
      }
    }

    // @ts-ignore
    if (!this._jscadViewer) {
      this._jscadViewer = this.openScadModule(this.viewerContext.current, {
        processor: {
          // * @property {Element} viewerContext - The main element that jscad uses.  If no canvas element is set, jscad creates one.
          // * @property {Element} viewerdiv - Jscad moves the canvas tag here, or creates one and places it here.
          // * @property {Element} parameterstable - A Table element reference.  The design parameters will be added here.
          // * @property {Element} viewerCanvas - A Canvas element reference that will be used to draw the GL canvas.
          viewerContext: this.viewerContext.current,
          viewerdiv: this.viewerDiv.current,
          viewerCanvas: this.viewerCanvas.current,
          parameterstable: this.parameterstable.current,
          setStatus: (status: "rendering" | "ready", _: any) => {
            // console.log("setStatus");
            // console.log(status);
            // Updates the internal status
            this.setState({ status });
            // console.log(data);
          },
          onUpdate: (data: any) => {
            // console.log("onUpdate");
            // console.log(data);
            if (data.outputFile) {
              this.setState({ outputFile: data.outputFile });
            }
          }
        },
        init: {
          viewerContext: this.viewerContext.current,
          viewerdiv: this.viewerDiv.current,
          viewerCanvas: this.viewerCanvas.current,
          parameterstable: this.parameterstable.current,
          instantUpdate: true,
          useAsync: true
        },
        viewer: {
          // axis: this.axis,
          // plate: {
          //   draw: true, // draw or not
          //   size: 200, // plate size (X and Y)
          //   // minor grid settings
          //   m: {
          //     i: 1, // number of units between minor grid lines
          //     color: { r: 0.8, g: 0.8, b: 0.8, a: 1.0 } // color
          //   },
          //   // major grid settings
          //   M: {
          //     i: 10, // number of units between major grid lines
          //     color: { r: 0.5, g: 0.3, b: 0.5, a: 1.0 } // color
          //   }
          // },
          camera: this.props.camera,
          glOptions: {
            canvas: this.viewerCanvas.current
          },
          background: { color: { r: 0.3, g: 0.3, b: 0.2, a: 1.0 } } // color
        }
      });

      // Ensures the component re-renders after unmounting + mounting again
      this.setState({ loadedDynamicImport: true });
      return;
    }

    // Applies props to build jscad script
    // console.log("UPDATE JSCAD?");

    // SETS INITIAL VIEWER STATE
    if (this.state.status === "empty") {
      // console.log("LOADED INITIAL JSCAD");
      if (this.props.jscadScript) {
        this._jscadViewer.setJsCad(this.props.jscadScript);
      }
      return;
    }

    // READY FOR ANOTHER RENDER?
    if (this.state.status === "ready") {
      // console.log("READY FOR ANOTHER RENDER");

      // Only render if props.jscadScript has changed
      if (prevProps.jscadScript !== this.props.jscadScript) {
        // console.log("JSCAD SCRIPT UPDATED");
        // TODO - use abort
        // this._jscadViewer.abort();
        this._jscadViewer.setJsCad(this.props.jscadScript);
      } else if (prevState.status === "rendering") {
        // Generate the STL if the viewer is ready
        this._jscadViewer.generateOutputFile({
          convertCAG: false,
          convertCSG: true,
          description: OutfileFileDescription.stla,
          displayName: OutfileFileDisplayName.stla,
          name: OutfileFileName.stla,
          extension: OutfileFileExtension.stla,
          mimetype: OutfileFileMimeType.stla
        });
      }
    }
  }

  // .viewerCanvas {
  //   width: 100 %;
  //   height: 480px;
  // }
  // .viewerContext.viewer canvas {
  //   width: 320px;
  //   height: 240px;
  // }
  // .viewerContext div.shift - scene {
  //   display: none;
  // }

  render() {
    const viewer = (
      <div>
        <div className="viewerContext" ref={this.viewerContext}>
          <div className="viewerDiv" ref={this.viewerDiv}></div>
        </div>

        <canvas
          // viewerCanvas
          style={{ width: "100%", height: "480px" }}
          ref={this.viewerCanvas}
        />
      </div>
    );

    return (
      <div className={this.props.className || ""}>
        <table ref={this.parameterstable}></table>

        {this.props.children === undefined && viewer}

        {this.props.children !== undefined &&
          this.props.children({
            viewer,
            outputFile: this.state.outputFile,
            status: this.state.status,
            refs: {
              viewerCanvas: this.viewerCanvas,
              viewerContext: this.viewerContext,
              viewerDiv: this.viewerDiv
            },
            resetCamera: () => {
              if (this._jscadViewer) {
                this._jscadViewer.resetCamera();
              }
            }
          })}
      </div>
    );
  }
}
