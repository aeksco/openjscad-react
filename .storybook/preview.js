import theme from "./theme";

export const parameters = {
    layout: "centered",
    options: {
        storySort: (a, b) => {
            if (a[0].includes("docs-") || b[0].includes("docs-")) {
                if (a[0].includes("intro-")) {
                    return -1;
                }
                if (b[0].includes("intro-")) {
                    return 1;
                }
                if (a[0].includes("quick")) {
                    return -1;
                }
            }

            if (a[0].includes("demos-")) {
                return -1;
            }

            if (b[0].includes("demos-")) {
                return 1;
            }

            if (a[0].includes("examples-")) {
                return a - b;
            }

            return a - b;
        },
    },
    docs: {
        theme,
    },
};
