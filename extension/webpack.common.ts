import * as path from 'path'
import { Configuration, DefinePlugin } from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import 'dotenv/config'

const config: Configuration = {
    entry: {
        sidePanel: path.resolve('sidePanel/index.tsx'),
        background: path.resolve('background/background.ts'),
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader', // postcss loader needed for tailwindcss
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [tailwindcss, autoprefixer],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                type: 'assets/resource',
                test: /\.(woff|woff2|tff|eot|svg)$/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('public'),
                    to: path.resolve('dist'),
                },
            ],
        }),
        ...getHtmlPlugins(['sidePanel']),
        new DefinePlugin({
            'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(
                process.env.REACT_APP_GOOGLE_CLIENT_ID
            ),
            'process.env.REACT_APP_GOOGLE_API_KEY': JSON.stringify(
                process.env.REACT_APP_GOOGLE_API_KEY
            ),
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin()],
    },
    output: {
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    stats: 'summary',
}

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HtmlPlugin({
                title: 'BrowseGPT',
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    )
}

export default config
