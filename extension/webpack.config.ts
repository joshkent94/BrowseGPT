import * as path from 'path'
import { Configuration, DefinePlugin } from 'webpack'
import HtmlPlugin from 'html-webpack-plugin'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { merge } from 'webpack-merge'
import { GhostProgressPlugin } from 'ghost-progress-webpack-plugin'
import 'dotenv/config'

type Mode = 'development' | 'production' | 'none'

const commonConfig = (extension: string, mode: Mode): Configuration => ({
    mode,
    entry: {
        sidePanel: path.resolve('shared/index.tsx'),
        background: path.resolve(`${extension}/background.ts`),
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
                        loader: 'postcss-loader',
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
        ...['sidePanel'].map(
            (chunk) =>
                new HtmlPlugin({
                    title: 'BrowseGPT',
                    filename: `${chunk}.html`,
                    chunks: [chunk],
                })
        ),
        new DefinePlugin({
            'process.env.REACT_APP_GOOGLE_CLIENT_ID_CHROME': JSON.stringify(
                process.env.REACT_APP_GOOGLE_CLIENT_ID_CHROME
            ),
            'process.env.REACT_APP_GOOGLE_CLIENT_ID_FIREFOX': JSON.stringify(
                process.env.REACT_APP_GOOGLE_CLIENT_ID_FIREFOX
            ),
            'process.env.REACT_APP_GOOGLE_CLIENT_ID_EDGE': JSON.stringify(
                process.env.REACT_APP_GOOGLE_CLIENT_ID_EDGE
            ),
            'process.env.REACT_APP_GOOGLE_CLIENT_SECRET_FIREFOX':
                JSON.stringify(
                    process.env.REACT_APP_GOOGLE_CLIENT_SECRET_FIREFOX
                ),
            'process.env.REACT_APP_GOOGLE_CLIENT_SECRET_EDGE': JSON.stringify(
                process.env.REACT_APP_GOOGLE_CLIENT_SECRET_FEDGE
            ),
            'process.env.REACT_APP_GOOGLE_PEOPLE_API_KEY': JSON.stringify(
                process.env.REACT_APP_GOOGLE_PEOPLE_API_KEY
            ),
            'process.env.REACT_APP_GITHUB_CLIENT_ID_CHROME': JSON.stringify(
                process.env.REACT_APP_GITHUB_CLIENT_ID_CHROME
            ),
            'process.env.REACT_APP_GITHUB_CLIENT_SECRET_CHROME': JSON.stringify(
                process.env.REACT_APP_GITHUB_CLIENT_SECRET_CHROME
            ),
            'process.env.REACT_APP_GITHUB_CLIENT_ID_FIREFOX': JSON.stringify(
                process.env.REACT_APP_GITHUB_CLIENT_ID_FIREFOX
            ),
            'process.env.REACT_APP_GITHUB_CLIENT_SECRET_FIREFOX':
                JSON.stringify(
                    process.env.REACT_APP_GITHUB_CLIENT_SECRET_FIREFOX
                ),
            'process.env.REACT_APP_GITHUB_CLIENT_ID_EDGE': JSON.stringify(
                process.env.REACT_APP_GITHUB_CLIENT_ID_EDGE
            ),
            'process.env.REACT_APP_GITHUB_CLIENT_SECRET_EDGE': JSON.stringify(
                process.env.REACT_APP_GITHUB_CLIENT_SECRET_EDGE
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
        new GhostProgressPlugin(),
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
})

const devConfig = (extension: string): Configuration => ({
    devtool: 'cheap-module-source-map',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('shared/public'),
                    to: path.resolve(`${extension}/dist`),
                },
                {
                    from: path.resolve('shared/pendo'),
                    to: path.resolve(`${extension}/dist`),
                },
            ],
        }),
    ],
    output: {
        path: path.join(__dirname, `${extension}/dist`),
    },
    watchOptions: {
        ignored: ['**/node_modules', '**/dist', '**/build', '**/packages'],
    },
})

const prodConfig = (extension: string): Configuration => ({
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('shared/public'),
                    to: path.resolve(`${extension}/build`),
                },
                {
                    from: path.resolve('shared/pendo'),
                    to: path.resolve(`${extension}/build`),
                },
            ],
        }),
    ],
    output: {
        path: path.join(__dirname, `${extension}/build`),
    },
})

const config = (env: any, args: any): Configuration => {
    try {
        const { extension } = env
        const { mode } = args
        const common = commonConfig(extension, mode)

        if (
            extension !== 'chrome' &&
            extension !== 'firefox' &&
            extension !== 'edge'
        ) {
            throw new Error(
                'Please specify a valid extension to build using the argument --extension=chrome|firefox|edge'
            )
        }

        if (mode === 'development') {
            return merge(common, devConfig(extension))
        }

        return merge(common, prodConfig(extension))
    } catch (error) {
        console.error(error.message)
    }
}

export default config
