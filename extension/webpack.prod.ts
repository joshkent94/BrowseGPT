import { merge } from 'webpack-merge'
import common from './webpack.common'
import { Configuration } from 'webpack'

const config: Configuration = merge(common, {
    mode: 'production',
})

export default config
