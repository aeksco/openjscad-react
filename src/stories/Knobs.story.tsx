import React from "react";
import "./tailwind.css";
import { storiesOf } from "@storybook/react";
import { OpenjscadViewer } from "../OpenjscadViewer";
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

export default {
    title: 'Examples/Test',
    decorators: [withKnobs],
};

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

export const scriptEditor = () => (
    <OpenjscadViewer
        jscadScript={text("JSCAD Script", DEFAULT_SCRIPT)}
    />
);
