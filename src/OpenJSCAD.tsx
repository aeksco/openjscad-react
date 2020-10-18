import React from "react";
import debounce from "lodash.debounce";
import {
  CameraProps,
  OutfileFileDescription,
  OutfileFileDisplayName,
  OutfileFileName,
  OutfileFileExtension,
  OutfileFileMimeType,
  JSCADViewer,
} from "./types";
import { WindowResizeObserver } from "./WindowResizeObserver";

// // // //

export interface ViewerChildProps {
  viewer: React.ReactNode;
  refs: {
    viewerCanvas: React.RefObject<any>;
    viewerContext: React.RefObject<any>;
    viewerDiv: React.RefObject<any>;
    parametersTable: React.RefObject<any>;
  };
  outputFile: any; // TODO - get beter type for this
  status: "empty" | "aborted" | "ready" | "rendering"; // TODO - add type union for this
  resetCamera: () => void;
}

export interface ViewerProps {
  jscadScript: string;
  className?: string;
  camera?: CameraProps;
  debug?: boolean;
  resizePlaceholder?: React.ReactNode;
  children?: (childProps: ViewerChildProps) => React.ReactNode;
}

export interface ViewerState {
  loadedDynamicImport: boolean;
  status: "empty" | "ready" | "rendering" | "aborted";
  outputFile: any;
  // TODO - add camera
}

// // // //

/**
 * Defines class-component for Openjscad viewer
 */
export class OpenJSCADInternal extends React.Component<ViewerProps, ViewerState> {
  viewerContext: React.RefObject<any>;
  viewerDiv: React.RefObject<any>;
  viewerCanvas: React.RefObject<any>;
  parametersTable: React.RefObject<any>;
  _jscadViewer: null | JSCADViewer;

  openScadModule: any;
  constructor(props: ViewerProps) {
    super(props);

    this.openScadModule = null;
    this.viewerContext = React.createRef();
    this.viewerDiv = React.createRef();
    this.viewerCanvas = React.createRef();
    this.parametersTable = React.createRef();
    this._jscadViewer = null;

    this.state = {
      loadedDynamicImport: false,
      status: "empty",
      outputFile: null,
    };
  }

  componentDidMount() {
    if (this.openScadModule) {
      this.setState({ loadedDynamicImport: true });
    }

    // @ts-ignore
    import("@jscad/web").then((module) => {
      // Set openjscad module
      this.openScadModule = module.default;

      // Set state.ready to true
      this.setState({ loadedDynamicImport: true });
    });
  }

  componentDidUpdate(prevProps: ViewerProps, prevState: ViewerState) {
    // Short-circuit if we have not loaded the dynamic import yet
    if (!this.openScadModule) {
      console.log('NO MODULE?');
      return;
    }
    if (!this.state.loadedDynamicImport) {
      console.log('NO IMPORT LOADED?');
      return;
    }

    if (!this.viewerCanvas.current) {
      console.log("NO VIEWER CANVAS PRESENT");
      setTimeout(() => {
        this.forceUpdate();
      }, 500)
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
      this._jscadViewer = this.openScadModule(
        this.viewerContext.current,
        {
          processor: {
            // * @property {Element} viewerContext - The main element that jscad uses.  If no canvas element is set, jscad creates one.
            // * @property {Element} viewerdiv - Jscad moves the canvas tag here, or creates one and places it here.
            // * @property {Element} parameterstable - A Table element reference.  The design parameters will be added here.
            // * @property {Element} viewerCanvas - A Canvas element reference that will be used to draw the GL canvas.
            viewerContext: this.viewerContext.current,
            viewerdiv: this.viewerDiv.current,
            viewerCanvas: this.viewerCanvas.current,
            parameterstable: this.parametersTable.current,
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
            },
          },
          init: {
            viewerContext: this.viewerContext.current,
            viewerdiv: this.viewerDiv.current,
            viewerCanvas: this.viewerCanvas.current,
            parameterstable: this.parametersTable.current,
            instantUpdate: true,
            useAsync: true,
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
              canvas: this.viewerCanvas.current,
            },
            background: {
              color: { r: 0.3, g: 0.3, b: 0.2, a: 1.0 },
            }, // color
          },
        },
      );

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
          mimetype: OutfileFileMimeType.stla,
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
        <table ref={this.parametersTable}></table>

        {this.props.children === undefined && viewer}

        {this.props.children !== undefined &&
          this.props.children({
            viewer,
            outputFile: this.state.outputFile,
            status: this.state.status,
            refs: {
              viewerCanvas: this.viewerCanvas,
              viewerContext: this.viewerContext,
              viewerDiv: this.viewerDiv,
              parametersTable: this.parametersTable,
            },
            resetCamera: () => {
              if (this._jscadViewer) {
                this._jscadViewer.resetCamera();
              }
            },
          })}
      </div>
    );
  }
}

// export class OpenJSCAD extends React.Component<ViewerProps, ViewerState> {
export function OpenJSCAD(props: ViewerProps) {
  return (
    <WindowResizeObserver debug={props.debug} >
      <OpenJSCADInternal {...props} />
    </WindowResizeObserver>
  );
}