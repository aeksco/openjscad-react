const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    stories: ["../src/**/*.story.tsx", "../docs/**/*.story.mdx"],
    addons: ["@storybook/addon-docs/preset"],
    webpackFinal: (config) => {
        return {
            ...config,
            optimization: {
                ...config.optimization,
                minimize: true,
                // NOTE - minimizer is necessary to handle a Safari (MacOS + iOS) specific issue
                // where where a variable name conflict was preventing Storybook from working correctly
                minimizer: [
                    new TerserPlugin({
                        test: /\.m?js(\?.*)?$/i,
                        extractComments: true,
                        parallel: true,
                        terserOptions: {
                            ecma: undefined,
                            parse: {},
                            compress: {},
                            mangle: true,
                            module: false,
                            output: null,
                            toplevel: false,
                            nameCache: null,
                            ie8: false,
                            keep_classnames: undefined,
                            keep_fnames: false,
                            safari10: false,
                        },
                    }),
                ],
            },
            module: {
                ...config.module,
                rules: [
                    // Filter out the default .css rule.
                    ...config.module.rules.filter(
                        (rule) => /\.css$/ !== rule.test,
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
