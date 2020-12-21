// https://jestjs.io/docs/en/configuration.html
module.exports = {
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
    roots: ["<rootDir>/src"],
    testPathIgnorePatterns: ["/node_modules/", "stories.tsx"],
    transform: {
        "\\.tsx?$": "ts-jest",
        "^.+\\.js$": "babel-jest",
    },
};
