const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {

    entry: "./src/index.js",

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",

        environment:{
            arrowFunction: false,
            const: false
        }
    },


    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "style-loader",
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                ident: "postcss",
                                plugins: [require("postcss-preset-env")()]
                            }
                        }
                    },
                    'less-loader'

                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: "./src/index.html"
        }),
    ],

    resolve: {
        extensions: ['.ts', '.js']
    }
}