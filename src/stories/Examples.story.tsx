import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenJSCAD, OpenJSCADInternal } from "../OpenJSCAD";
import { DEFAULT_SCRIPT } from "./test_state"

// // // //

storiesOf("Examples/Layouts", module)
  .add(
    "Simple",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
        />
      );
    })
  .add(
    "Custom",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
        >
          {childProps => {
            return (
              <div className="grid grid-cols-2 w-full">
                <div className="px-4">
                  {/* EXAMPLE USING REFS DIRECTLY */}
                  <div ref={childProps.refs.viewerContext}>
                    <div ref={childProps.refs.viewerDiv}></div>
                  </div>

                  {/* Don't forget parametersTable! */}
                  <table ref={childProps.refs.parametersTable}></table>

                  <canvas
                    style={{ width: "100%", height: "480px" }}
                    ref={childProps.refs.viewerCanvas}
                  />

                </div>

                <div className="px-4">
                  <button
                    className="btn"
                    onClick={() => {
                      childProps.resetCamera();
                    }}
                  >
                    Reset Camera
                  </button>
                </div>
              </div>

            );
          }}
        </OpenJSCAD>
      );
    }
  )

// // // // 

storiesOf("Examples/Camera", module)
  .add(
    "Reset Camera",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
        >
          {childProps => {
            return (
              <div>
                {childProps.viewerElement}

                <button
                  className="btn mt-2"
                  onClick={() => {
                    childProps.resetCamera();
                  }}
                >
                  Reset Camera
                </button>
              </div>
            );
          }}
        </OpenJSCAD>
      );
    }
  )
  .add(
    "Starting Position - Clip",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
          camera={{
            clip: { min: 1, max: 500 }
          }}
        />
      );
    }
  )
  .add(
    "Starting Position - Position",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
          camera={{
            position: { x: 50, y: 50, z: 250 },
          }}
        />
      );
    }
  )
  .add(
    "Starting Position - Angle",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
          camera={{
            // angle: { x: -45, y: 0, z: 170 },
            angle: { x: -60, y: 0, z: 45 },
          }}
        />
      );
    }
  )
  .add(
    "Starting Position - Field Of View",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
          camera={{
            fov: 15
          }}
        />
      );
    }
  )

// // // // 

storiesOf("Examples/Resize Placeholder", module)
  .add(
    "static",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
          resizePlaceholder={
            <div className="w-full min-h-full h-full bg-gray-100 flex justify-center">
              <p className="py-56">Resizing...</p>
            </div>
          }
        />
      );
    })
  .add(
    "static w/o window resize",
    () => {
      return (
        <OpenJSCADInternal
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
        />
      );
    })
  .add(
    "function",
    () => {
      return (
        <OpenJSCAD
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
          resizePlaceholder={() => {
            const currentTime = new Date().toUTCString();
            return (
              <div className="w-full min-h-full h-full bg-gray-200 flex justify-center">
                <p className="py-56 text-center">
                  Resizing...
                  <span className="block text-xs">Time: {currentTime}</span>
                </p>
              </div>
            )
          }}
        />
      );
    })