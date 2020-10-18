import debounce from "lodash.debounce";
import React from "react";

// // // //

interface WindowResizeObserverProps {
    debug?: boolean
    resizePlaceholder?: React.ReactNode;
    children: React.ReactNode;
}

interface WindowResizeObserverState {
    shouldRender: boolean;
    windowWidth: number;
    windowHeight: number;
}

/**
 * WindowResizeObserver
 * TODO - annotate this
 */
export class WindowResizeObserver extends React.Component<WindowResizeObserverProps, WindowResizeObserverState> {
    constructor(props: WindowResizeObserverProps) {
        super(props);

        this.handleResize = debounce(this.handleResize, 50).bind(this)
        // this.handleResize = this.handleResize.bind(this)
        this.handleShouldRender = debounce(this.handleShouldRender, 500).bind(this)

        this.state = {
            shouldRender: true,
            windowWidth: 0,
            windowHeight: 0,
        };
    }

    handleShouldRender() {
        this.setState({
            shouldRender: true,
        })
    }

    handleResize() {
        this.setState({
            shouldRender: false,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        })

        // Fires off debounces function to show the input again
        this.handleShouldRender();
    }

    componentDidMount() {
        // Sets initial size when components mounts
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        })

        // Add resize event listener
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    render() {
        const { debug, resizePlaceholder = null } = this.props;
        const { shouldRender, windowWidth, windowHeight } = this.state;

        if (!shouldRender) {
            return (
                <React.Fragment>
                    {debug && (
                        <pre>{JSON.stringify({ windowWidth, windowHeight, shouldRender }, null, 4)}</pre>
                    )}
                    {resizePlaceholder}
                </React.Fragment>
            );
        }

        if (shouldRender) {
            return (
                <React.Fragment>
                    {debug && (
                        <pre>{JSON.stringify({ windowWidth, windowHeight, shouldRender }, null, 4)}</pre>
                    )}
                    {this.props.children}
                </React.Fragment>
            );
        }

        // Return null
        return null;
    }
}