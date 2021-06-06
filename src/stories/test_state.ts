import { CSSProperties } from "react";
import { PosNegColor } from "../lib/types";
// UG! 'modeling' is cluttering GLOBAL name space
// @ts-ignore
import { primitives } from "@jscad/modeling";

// // // //

export const DEFAULT_SCRIPT = [
    primitives.cube({
        center: [0, 0, 0],
        size: 10,
    }),
];
// `
// function main () {
//   return union(
//     difference(
//       cube({size: 3, center: true}),
//       sphere({r: 2, center: true})
//     ),
//     intersection(
//       sphere({r: 1.3, center: true}),
//       cube({size: 2.1, center: true})
//     )
//   ).translate([0, 0, 1.5]).scale(10);
// }
// `;

export const POS_NEG_COLOR: PosNegColor = {
    pos: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    },
    neg: {
        r: 0.5,
        g: 0.5,
        b: 0.5,
        a: 1,
    },
};

export const EXAMPLE_STYLES: CSSProperties = {
    height: "480px",
    width: "100%",
};

export const EXAMPLE_CLASSNAME: string = "grid grid-cols-1 w-full";
