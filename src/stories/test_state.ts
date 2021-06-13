import { CSSProperties } from "react";
import { PosNegColor } from "../lib/types";
// @ts-ignore
import { primitives, booleans, transforms } from "@jscad/modeling";

// // // //

export const DEFAULT_SCRIPT = [
    primitives.cube({
        center: [0, 0, 0],
        size: 30,
    }),
];

export function OpenJSCADLogo() {
    return [
        transforms.scale(
            [10, 10, 10],
            booleans.union(
                booleans.subtract([
                    primitives.cube({ size: 3, center: [0, 0, 0] }),
                    primitives.sphere({ radius: 2, center: [0, 0, 0] }),
                ]),
                booleans.intersect(
                    primitives.sphere({ radius: 1.3, center: [0, 0, 0] }),
                    primitives.cube({ size: 2.1, center: [0, 0, 0] }),
                ),
            ),
        ),
    ];
}

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
