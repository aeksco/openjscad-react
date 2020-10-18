import React, {
  ReactNode,
  RefObject,
} from "react";
import debounce from "lodash.debounce";
import {
  CameraSettings,
  OutfileFileDescription,
  OutfileFileDisplayName,
  OutfileFileName,
  OutfileFileExtension,
  OutfileFileMimeType,
  ProcessorState,
  Processor,
} from "./types";
import { WindowResizeObserver, WindowResizeObserverProps } from "./WindowResizeObserver";

// // // //

/**
 * ViewerChildProps
 * Props passed to the `children` function on `ViewerProps`
 * @param props.viewerElement: a pre-built TSX/JSX element that may be returned inside the ReactNode returned by props.children. Useful for positioning the Viewer somewhere specific.
 * @param props.refs: (advanced usage) an object encapsulating required RefObjects that may be assigned to JSX/TSX elements returned by props.children. Note that all refs must be assigned.
 * @param props.outputFile: (advanced usage) an object encapsulating required RefObjects that may be assigned to JSX/TSX elements returned by props.children. Note that all refs must be assigned.
 */
export interface ViewerChildProps {
  viewerElement: ReactNode;
  refs: {
    viewerCanvas: RefObject<HTMLCanvasElement>;
    viewerContext: RefObject<HTMLDivElement>;
    viewerDiv: RefObject<HTMLDivElement>;
    parametersTable: RefObject<HTMLTableElement>;
  };
  outputFile: null | string;
  status: ProcessorState,
  resetCamera: () => void;
}

// TODO - rename this interface to not use Viewer terminology
export interface ViewerProps {
  jscadScript: string;
  className?: string;
  camera?: CameraSettings;
  debug?: boolean;
  children?: (childProps: ViewerChildProps) => ReactNode;
}

// TODO - rename this interface to not use Viewer terminology
export interface ViewerState {
  loadedDynamicImport: boolean;
  status: ProcessorState;
  outputFile: any;
  // TODO - add camera
  // TODO - add other props here
  // TODO - add other props here
  // TODO - add other props here
}

// // // //

// TODO - annotate
// TODO - rename this.
export class OpenJSCADInternal extends React.Component<ViewerProps, ViewerState> {
  viewerContext: React.RefObject<HTMLDivElement>;
  viewerDiv: React.RefObject<HTMLDivElement>;
  viewerCanvas: React.RefObject<HTMLCanvasElement>;
  parametersTable: React.RefObject<HTMLTableElement>;
  processor: null | Processor;
  openScadModule: any;

  constructor(props: ViewerProps) {
    super(props);

    this.openScadModule = null;
    this.viewerContext = React.createRef();
    this.viewerDiv = React.createRef();
    this.viewerCanvas = React.createRef();
    this.parametersTable = React.createRef();
    this.processor = null;

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

    console.log(this.processor);

    // Short-circuit function if current state is rendering
    if (this.state.status === "rendering") {
      // return;

      if (
        this.processor &&
        prevProps.jscadScript !== this.props.jscadScript
      ) {
        // console.log("JSCAD SCRIPT UPDATED");
        // TODO - use abort
        this.processor.abort();
        this.processor.setJsCad(this.props.jscadScript);
      }
    }

    // @ts-ignore
    if (!this.processor) {
      this.processor = this.openScadModule(
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


            // debug: false,
            // libraries: [],
            // openJsCadPath: '',
            // useAsync: true,
            // useSync: true,
            // viewer: {}


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
            // // // //
            // 
            // TODO - add support for axis option
            // axis: this.axis
            // 
            // // // //
            // 
            // TODO - add support for plate option
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
            // 
            // // // // 
            // 
            // TODO - add support for solid option
            // solid: {
            // outlineColor
            // draw
            // faceColor
            // lines
            // outlineColor
            // overlay
            // smooth
            // },
            // 
            // // // // 
            // TODO - add support for options.engine
            // // // // 
            camera: this.props.camera,
            glOptions: {
              canvas: this.viewerCanvas.current,
            },
            background: {
              color: { r: 0.8, g: 0.3, b: 0.2, a: 1.0 },
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
        this.processor.setJsCad(this.props.jscadScript);
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
        // this.processor.abort();
        this.processor.setJsCad(this.props.jscadScript);
      } else if (prevState.status === "rendering") {
        // Generate the STL if the viewer is ready
        this.processor.generateOutputFile({
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

  render() {
    const { className = undefined } = this.props;

    const viewerElement = (
      <div className={className}>
        <div ref={this.viewerContext}>
          <div ref={this.viewerDiv}></div>
        </div>

        <canvas
          style={{ width: "100%", height: "480px" }} // TODO - accept this as a prop, scope out that update
          ref={this.viewerCanvas}
        />
      </div>
    );

    return (
      <div className={className}>
        <table ref={this.parametersTable}></table>

        {/* Render viewer element  */}
        {this.props.children === undefined && viewerElement}

        {/* Rener props.children */}
        {this.props.children !== undefined &&
          this.props.children({
            viewerElement,
            outputFile: this.state.outputFile,
            status: this.state.status,
            refs: {
              viewerCanvas: this.viewerCanvas,
              viewerContext: this.viewerContext,
              viewerDiv: this.viewerDiv,
              parametersTable: this.parametersTable,
            },
            resetCamera: () => {
              if (this.processor) {
                this.processor.resetCamera();
              }
            },
          })}
      </div>
    );
  }
}

// // // // 

/**
 * OpenJSCAD
 * TODO - annotate
 * @param props 
 */
export function OpenJSCAD(props: ViewerProps & WindowResizeObserverProps) {
  return (
    <WindowResizeObserver debug={props.debug} resizePlaceholder={props.resizePlaceholder}>
      <OpenJSCADInternal {...props} />
    </WindowResizeObserver>
  );
}