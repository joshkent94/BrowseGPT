import * as path from 'path'
import { Configuration, DefinePlugin } from 'webpack'
import HtmlPlugin from 'html-webpack-plugin'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import 'dotenv/config'
import CopyPlugin from 'copy-webpack-plugin'

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
        ...getHtmlPlugins(['sidePanel']),
        new DefinePlugin({
            'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(
                process.env.REACT_APP_GOOGLE_CLIENT_ID
            ),
            'process.env.REACT_APP_GOOGLE_API_KEY': JSON.stringify(
                process.env.REACT_APP_GOOGLE_API_KEY
            ),
            'process.env.REACT_APP_GITHUB_CLIENT_ID': JSON.stringify(
                process.env.REACT_APP_GITHUB_CLIENT_ID
            ),
            'process.env.REACT_APP_GITHUB_CLIENT_SECRET': JSON.stringify(
                process.env.REACT_APP_GITHUB_CLIENT_SECRET
            ),
            'process.env.REACT_APP_FACEBOOK_CLIENT_ID': JSON.stringify(
                process.env.REACT_APP_FACEBOOK_CLIENT_ID
            ),
            'process.env.REACT_APP_FACEBOOK_CLIENT_SECRET': JSON.stringify(
                process.env.REACT_APP_FACEBOOK_CLIENT_SECRET
            ),
            'process.env.REACT_APP_STATE_SECRET': JSON.stringify(
                process.env.REACT_APP_STATE_SECRET
            ),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('pendo'),
                    to: path.resolve('dist'),
                },
            ],
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
