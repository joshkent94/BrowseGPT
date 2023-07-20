import { merge } from 'webpack-merge'
import common from './webpack.common'
import { Configuration, DefinePlugin } from 'webpack'
import * as path from 'path'
import CopyPlugin from 'copy-webpack-plugin'

const config: Configuration = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('public'),
                    to: path.resolve('dist'),
                },
                {
                    from: path.resolve('pendo'),
                    to: path.resolve('dist'),
                },
            ],
        }),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
    },
})

export default config
