import React from "react";
import { OpenJSCADProps } from "./types";
import {
    WindowResizeObserver,
    WindowResizeObserverProps,
} from "./WindowResizeObserver";
import { useDebounce } from "./useDebounce";
import { OpenJSCADProcessor } from "./OpenJSCADProcessor";

// // // //

/**
 * OpenJSCAD
 * Exports the OpenJSCADProcessor component wrapped in
 * the WindowResizeObserver w/ debounced state for props.jscadScript
 * @param props - See `OpenJSCADProps` and `WindowResizeObserverProps`
 */
export function OpenJSCAD(
    props: OpenJSCADProps &
        WindowResizeObserverProps & { debounceTimeout?: number },
) {
    // Sets up debounce for changes in props.jscadScript
    // Significatnly improves performance
    const { debounceTimeout = 500 } = props;
    const [state, setState] = useDebounce(
        {
            jscadScript: props.jscadScript,
        },
        debounceTimeout,
    );

    React.useEffect(() => {
        setState({
            jscadScript: props.jscadScript,
        });
    }, [props.jscadScript]);

    return (
        <WindowResizeObserver
            debug={props.debug}
            loadingPlaceholder={props.loadingPlaceholder}
        >
            <OpenJSCADProcessor {...props} jscadScript={state.jscadScript} />
        </WindowResizeObserver>
    );
}
