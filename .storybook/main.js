module.exports = {
    stories: ["../src/**/*.story.tsx", "../docs/**/*.story.mdx"],
    addons: ["@storybook/addon-docs/preset"],
    webpackFinal: config => {
        return {
            ...config,
            module: {
                ...config.module,
                rules: [
                    // Filter out the default .css rule.
                    ...config.module.rules.filter(
                        rule => /\.css$/ !== rule.test,
                    ),
                    // Add our own css rule which in turn will read the postcss.config.js from project root.
                    {
                        test: /\.css1$/,
                        exclude: [/\.module\.css$/, /@storybook/],
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: { importLoaders: 1, sourceMap: false },
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    ident: "postcss",
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                ],
            },
        };
    },
};
