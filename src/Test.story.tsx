import React from "react";
import { storiesOf } from "@storybook/react";
import { OpenjscadViewer } from "./OpenjscadViewer";

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

storiesOf("Tests/Test Story", module).add(
  "Simple",
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
          {() => {
            return <p>Child Props</p>;
          }}
        </OpenjscadViewer>
      </div>
    );
  }
  // { options: { showPanel: true } }
);
