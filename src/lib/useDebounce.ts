import React from "react";
import lodashDebounce from "lodash.debounce";

/**
 * useDebounce
 * Debounce function used by OpenJSCAD component to debounce
 * changes in props.jscadScript passed into the OpenJSCADProcessor component
 * @param obj - The state being stored in a debounced state
 * @param wait - optional - the debounce timeout
 */
export function useDebounce(obj: any = null, wait: number = 1000) {
    const [state, setState] = React.useState(obj);

    const setDebouncedState = (_val: any) => {
        debounce(_val);
    };

    const debounce = React.useCallback(
        lodashDebounce((_prop: string) => {
            setState(_prop);
        }, wait),
        [],
    );

    return [state, setDebouncedState];
}
