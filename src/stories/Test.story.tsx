import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenjscadViewer } from "../OpenjscadViewer";
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

// // // //

const DEFAULT_SCRIPT = `
function main () {
  return union(
    difference(
      cube({size: 3, center: true}),
      sphere({r: 2, center: true})
    ),
    intersection(
      sphere({r: 1.3, center: true}),
      cube({size: 2.1, center: true})
    )
  ).translate([0, 0, 1.5]).scale(10);
}
`;

storiesOf("Tests/Test Story", module)
  .add(
    "Complex",
    () => {
      return (
        <div className="w-6/12">
          <OpenjscadViewer
            jscadScript={DEFAULT_SCRIPT}
            camera={{
              angle: { x: -45, y: 0, z: 170 },
              position: { x: 0, y: 0, z: 200 },
              clip: { min: 1, max: 1000 }
            }}
          >
            {childProps => {
              return (
                <div>
                  <button
                    onClick={() => {
                      childProps.resetCamera();
                    }}
                  >
                    Reset Camera
                  </button>

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

                  {/* {childProps.viewer} */}
                </div>
              );
            }}
          </OpenjscadViewer>
        </div>
      );
    }
    // { options: { showPanel: true } }
  )
  .add(
    "Simple",
    () => {
      return (
        <OpenjscadViewer
          className="grid grid-cols-1 w-full"
          jscadScript={DEFAULT_SCRIPT}
        />
      );
    })
  .add(
    "Reset Camera",
    () => {
      return (
        <div className="w-6/12">
          <OpenjscadViewer
            jscadScript={DEFAULT_SCRIPT}
          >
            {childProps => {
              return (
                <div>
                  {childProps.viewer}

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
          </OpenjscadViewer>
        </div>
      );
    }
  )
  .add(
    "props.camera",
    () => {
      return (
        <div className="w-6/12">
          <OpenjscadViewer
            jscadScript={DEFAULT_SCRIPT}
            camera={{
              angle: { x: -45, y: 0, z: 170 },
              position: { x: 0, y: 0, z: 200 },
              clip: { min: 1, max: 1000 }
            }}
          >
            {childProps => {
              return (
                <div>
                  {childProps.viewer}

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
          </OpenjscadViewer>
        </div>
      );
    }
  )
