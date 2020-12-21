import debounce from "lodash.debounce";
import React from "react";

// // // //

// Feature - pass loadingPlaceholder into <OpenJSCAD/> to render while initializing?
export interface WindowResizeObserverProps {
    debug?: boolean;
    loadingPlaceholder?: React.ReactNode | (() => React.ReactNode);
}

interface WindowResizeObserverState {
    shouldRender: boolean;
    windowWidth: number;
    windowHeight: number;
}

/**
 * WindowResizeObserver
 * Listens for window resize events and re-renders props.children when a change is detected
 */
export class WindowResizeObserver extends React.Component<
    WindowResizeObserverProps & { children: React.ReactNode },
    WindowResizeObserverState
> {
    constructor(
        props: WindowResizeObserverProps & { children: React.ReactNode },
    ) {
        super(props);

        this.handleResize = debounce(this.handleResize, 50).bind(this);
        this.handleShouldRender = debounce(this.handleShouldRender, 250).bind(
            this,
        );

        this.state = {
            shouldRender: true,
            windowWidth: 0,
            windowHeight: 0,
        };
    }

    handleShouldRender() {
        this.setState({
            shouldRender: true,
        });
    }

    handleResize() {
        // Short-circuit change event if window dimensions haven't changed
        // NOTE - this is necessary to handle erroneous window resize events in iOS devices
        if (
            window.innerHeight === this.state.windowHeight &&
            window.innerWidth === this.state.windowWidth
        ) {
            return;
        }

        this.setState({
            shouldRender: false,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        });

        // Fires off debounces function to show the input again
        this.handleShouldRender();
    }

    componentDidMount() {
        // Sets initial size when components mounts
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        });

        // Add resize event listener
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    render() {
        const {
            debug,
            loadingPlaceholder: resizePlaceholder = null,
        } = this.props;
        const { shouldRender, windowWidth, windowHeight } = this.state;

        let resizePlaceholderVal: React.ReactNode | null = null;

        if (
            resizePlaceholder !== null &&
            typeof resizePlaceholder === "function"
        ) {
            resizePlaceholderVal = resizePlaceholder();
        } else if (resizePlaceholder !== null) {
            resizePlaceholderVal = resizePlaceholder;
        }

        if (!shouldRender) {
            return (
                <React.Fragment>
                    {debug && (
                        <pre>
                            {JSON.stringify(
                                { windowWidth, windowHeight, shouldRender },
                                null,
                                4,
                            )}
                        </pre>
                    )}
                    {resizePlaceholderVal}
                </React.Fragment>
            );
        }

        if (shouldRender) {
            return (
                <React.Fragment>
                    {debug && (
                        <pre>
                            {JSON.stringify(
                                { windowWidth, windowHeight, shouldRender },
                                null,
                                4,
                            )}
                        </pre>
                    )}
                    {this.props.children}
                </React.Fragment>
            );
        }

        // Return null
        return null;
    }
}
