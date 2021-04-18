const path = require("path");

module.exports = {
    entry: path.join(__dirname, "./src/index.tsx"),
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "index.js",
        libraryTarget: "commonjs2",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    externals: {
        react: "commonjs react",
    },
};
