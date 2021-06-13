import React from "react";
import { OpenJSCADProps } from "./types";
import { useDebounce } from "./useDebounce";
import { OpenJSCADProcessor } from "./OpenJSCADProcessor";

// // // //

/**
 * OpenJSCAD
 * Exports the OpenJSCADProcessor component wrapped in
 * the WindowResizeObserver w/ debounced state for props.solids
 * @param props - See `OpenJSCADProps` and `WindowResizeObserverProps`
 */
export function OpenJSCAD(props: OpenJSCADProps) {
    // Sets up debounce for changes in props.solids
    // Significatnly improves performance
    const { debounceTimeout = 500 } = props;
    const [state, setState] = useDebounce(
        {
            solids: props.solids,
        },
        debounceTimeout,
    );

    React.useEffect(() => {
        setState({
            solids: props.solids,
        });
    }, [props.solids]);

    return <OpenJSCADProcessor {...props} />;
}
