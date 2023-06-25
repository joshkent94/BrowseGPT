import { merge } from 'webpack-merge'
import common from './webpack.common'
import { Configuration } from 'webpack'

const config: Configuration = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
})

export default config
