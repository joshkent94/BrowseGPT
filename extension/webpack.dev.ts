import { merge } from 'webpack-merge'
import common from './webpack.common'
import { Configuration, DefinePlugin } from 'webpack'
import * as path from 'path'

const config: Configuration = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
    },
})

export default config
