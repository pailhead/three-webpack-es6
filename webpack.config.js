'use strict' // eslint-disable-line strict

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'
const __DEV__ = NODE_ENV !== 'production'
const __PROD__ = NODE_ENV === 'production'

let config

if (__DEV__) {
    config = {
        context: path.join(__dirname, 'src'),
        entry: {
            app: ['webpack-hot-middleware/client?reload=true', './index.js'],
            vendor: ['three']
        },
        resolve: {
            extensions: ['.js'],
            modules: [path.resolve('./src'), path.resolve('./node_modules')]
        },
        output: {
            path: path.join(__dirname, 'build'),
            filename: '[name].bundle.js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        quiet: true
                    }
                },

                {
                    test: /\.js$/,
                    loaders: 'babel-loader',
                    query: {
                        presets: [
                            ['es2015', { modules: false }],
                            'stage-0',
                            'stage-2'
                        ]
                    }
                },

                {
                    test: /\.scss$/,
                    loaders: [
                        'style-loader',
                        'css-loader?importLoaders=1&sourceMap',
                        'resolve-url-loader?keepQuery!',
                        'postcss-loader?sourceMap',
                        {
                            loader: 'sass-loader?sourceMap',
                            options: {
                                includePaths: [
                                    path.resolve(__dirname, 'src'),
                                    'node_modules'
                                ]
                            }
                        }
                    ]
                },

                {
                    test: /\.(jpg|png)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name]-[hash].[ext]'
                        // includePaths: [path.resolve(__dirname, 'src')]
                    }
                },

                {
                    test: /\.(glsl|frag|vert|vs|fs)$/i, //require(shaders.vert|frag)
                    loader: 'raw-loader',
                    exclude: /node_modules/
                    // includePaths: [path.resolve(__dirname, 'src')]
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('app.[contenthash:20].css'),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/index.html')
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                __DEV__,
                __PROD__
            })
        ],
        devtool: 'inline-source-map'
    }
}

if (__PROD__) {
    config = {
        context: path.join(__dirname, 'src'),
        entry: {
            app: ['./index.js'],
            vendor: ['three']
        },
        resolve: {
            extensions: ['.js'],
            modules: [path.resolve('./src'), path.resolve('./node_modules')]
        },
        output: {
            path: path.join(__dirname, 'build'),
            filename: '[name].bundle.js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loaders: 'babel-loader',
                    query: {
                        presets: [
                            ['es2015', { modules: false }],
                            'stage-0',
                            'stage-2'
                        ]
                    }
                },

                {
                    test: /\.scss$/,
                    loaders: [
                        'style-loader',
                        'css-loader?importLoaders=1&sourceMap',
                        'resolve-url-loader?keepQuery!',
                        'postcss-loader?sourceMap',
                        {
                            loader: 'sass-loader?sourceMap',
                            options: {
                                includePaths: [
                                    path.resolve(__dirname, 'src'),
                                    'node_modules'
                                ]
                            }
                        }
                    ]
                },

                {
                    test: /\.(jpg|png)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name]-[hash].[ext]'
                        // includePaths: [path.resolve(__dirname, 'src')]
                    }
                },

                {
                    test: /\.(glsl|frag|vert|vs|fs)$/i, //require(shaders.vert|frag)
                    loader: 'raw-loader',
                    exclude: /node_modules/
                    // includePaths: [path.resolve(__dirname, 'src')]
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('app.[contenthash:20].css'),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/index.html')
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
            new webpack.optimize.UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: true,
                        drop_console: true
                    }
                },
                parallel: true
            }),
            new webpack.DefinePlugin({
                __DEV__,
                __PROD__
            })
        ],
        devtool: 'hidden-source-map'
    }
}

module.exports = config
