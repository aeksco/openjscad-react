import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenjscadViewer } from "../OpenjscadViewer";

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
        <div style={{ height: "50%", width: "50%" }}>
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
        <div className="w-50">
          <OpenjscadViewer
            jscadScript={DEFAULT_SCRIPT}
            camera={{
              angle: { x: -45, y: 0, z: 170 },
              position: { x: 0, y: 0, z: 200 },
              clip: { min: 1, max: 1000 }
            }}
          />
        </div>
      );
    }
    // { options: { showPanel: true } }
  )
  .add("Tailwind", () => {
    return (
      <div>
        <p className="text-blue-300">This is a tailwind css test</p>
      </div>
    );
  });
