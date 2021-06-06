// UG! 'modeling' is cluttering GLOBAL name space
// @ts-ignore
import { primitives } from "@jscad/modeling";

export const getPrimitives = (count: number) => {
  let solids = []
  for (let i=0; i < count; i++) {
    let geom = primitives.cube({
      center: [0, 0, (i*10)],
      size: 10
    });
    solids.push(geom)
  }

  // return [geom];
  return solids;
};
