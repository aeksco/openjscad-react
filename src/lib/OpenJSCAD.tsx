import React from "react";
import { OpenJSCADProps } from "./types";
// import { WindowResizeObserver } from "./WindowResizeObserver";
// import { useDebounce } from "./useDebounce";
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
    // const { debounceTimeout = 500 } = props;
    // const [state, setState] = useDebounce(
    //     {
    //         solids: props.solids,
    //     },
    //     debounceTimeout,
    // );

    // React.useEffect(() => {
    //     setState({
    //         solids: props.solids,
    //     });
    // }, [props.solids]);

    // TODO - find out if we still need the WindowResizeObserver
    return (
        <div className="grid grid-cols-1 mt-5">
            <OpenJSCADProcessor {...props} />
            {/* <WindowResizeObserver
                debug={props.debug}
                loadingPlaceholder={props.loadingPlaceholder}
            > */}
            {/* </WindowResizeObserver> */}
        </div>
    );
}
