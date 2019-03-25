const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

let config = {
    entry: {
        vendor: "./vendor.js",
        app: "./js/script.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ // used to parse/load css and inject in head tag
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            },
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '/images/[name]_[hash:7].[ext]'
                        }
                    },
                ]
            }
        ]
    },
    context: path.resolve(__dirname, '../'), // setting base path for webpack 
    plugins: [
        new HtmlWebpackPlugin({ //finds index.html as root and bundles n inject above js bundles into script
            template: "./index.html",   // Input FileName
            filename: "./index.html"    // Output FileName
        }),
        // new webpack.HotModuleReplacementPlugin(), // Enabling HMR
        new ExtractTextPlugin('[name].css'), // plugin used to extract css which will used in module rule config above
        new CopyWebpackPlugin([
            {
                from: './images/*.png',
                to: './images',
                flatten: true
            }, {
                from: './images/*.mp3',
                to: './images',
                flatten: true
            }, {
                from: './js/*.json',
                to: './',
                flatten: true
            }
        ], {}),
        new webpack.ProvidePlugin({
            modernizr: 'modernizr'
        })
    ],
    optimization: {
        namedModules: false, // NamedModulesPlugin()
        splitChunks: { // CommonsChunkPlugin()
            name: 'vendor',
            minChunks: 2
        },
        noEmitOnErrors: true, // NoEmitOnErrorsPlugin
        concatenateModules: false //ModuleConcatenationPlugin,
    }
}

module.exports = config;