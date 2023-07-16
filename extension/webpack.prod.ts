import { merge } from 'webpack-merge'
import common from './webpack.common'
import { Configuration, DefinePlugin } from 'webpack'
import * as path from 'path'
import CopyPlugin from 'copy-webpack-plugin'

const config: Configuration = merge(common, {
    mode: 'production',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('public'),
                    to: path.resolve('build'),
                },
            ],
        }),
    ],
    output: {
        path: path.join(__dirname, 'build'),
    },
})

export default config
