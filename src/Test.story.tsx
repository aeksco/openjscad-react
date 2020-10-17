import React from "react";
import { storiesOf } from "@storybook/react";
import { OpenjscadViewer } from "./OpenjscadViewer";

// // // //

storiesOf("Tests/Test Story", module).add(
  "Simple",
  () => {
    const [size, setSize] = React.useState<number>(3);

    const jscadScript = `
function main () {
  return union(
    difference(
      cube({size: ${size}, center: true}),
      sphere({r: ${(size * 2) / 3}, center: true})
    ),
    sphere({r: ${(size * 1) / 3}, center: true})
  ).translate([0, 0, 1.5]).scale(10);
}
    `;

    return (
      <div style={{ height: "100%", width: "100%" }}>
        <p>Adjust Size</p>

        <input
          value={size}
          min={2}
          max={10}
          type="range"
          onChange={e => {
            setSize(Number(e.currentTarget.value));
          }}
        />

        <OpenjscadViewer
          jscadScript={jscadScript}
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
