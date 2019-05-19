// node modules

// const path = require('path')
// const webpack = require('webpack')

// webpack plugins
// eslint-disable-next-line prefer-destructuring
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const CreateSymlinkPlugin = require('create-symlink-webpack-plugin')
// const CriticalCssPlugin = require('critical-css-webpack-plugin')
// const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const PurgecssPlugin = require('purgecss-webpack-plugin')
// const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebappWebpackPlugin = require('webapp-webpack-plugin')
// const WhitelisterPlugin = require('purgecss-whitelister')
const WorkboxPlugin = require('workbox-webpack-plugin')
const Critters = require('critters-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const CompressionPlugin = require('compression-webpack-plugin')
const zopfli = require('@gfx/zopfli')

const commonPaths = require('./paths')
// Configure Bundle Analyzer
const configureBundleAnalyzer = () => ({
  analyzerMode: 'static',
  reportFilename: 'report-modern.html',
})

// Configure terser
const configureTerser = () => ({
  cache: true,
  parallel: true,
  sourceMap: true,
})

const configureOptimization = () => ({
  splitChunks: {
    chunks: 'all',
  },
  minimizer: [
    new TerserPlugin(configureTerser()),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: false,
          annotation: true,
        },
        safe: true,
        discardComments: true,
      },
    }),
  ],
})
// Configure Webapp webpack
const configureWebapp = () => ({
  logo: './src/logo.png',
  prefix: commonPaths.favicon,
  cache: false,
  inject: 'force',
  favicons: {
    appName: 'Portfolio',
    appDescription:
      'Portfolio de un desarrollador Front End en el cual se muestra algunos trabajos',
    developerName: 'Alberto Perez',
    developerURL: null,
    path: commonPaths.outputPath,
  },
})

// Configure Workbox service worker
const configureWorkbox = () => {
  const config = commonPaths.workboxConfig
  return config
}

module.exports = {
  mode: 'production',
  output: {
    filename: `${commonPaths.jsFolder}/[name].[hash].js`,
    path: commonPaths.outputPath,
    chunkFilename: '[name].[chunkhash].js',
  },
  optimization: configureOptimization(),
  module: {
    rules: [
      {
        test: /\.(css|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: true,
              camelCase: true,
              localIdentName: '[local]___[hash:base64:5]',
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([commonPaths.outputPath.split('/').pop()], {
      root: commonPaths.root,
      verbose: true,
      dry: false,
    }),

    new MiniCssExtractPlugin({
      filename: `${commonPaths.cssFolder}/[name].css`,
      chunkFilename: '[id].css',
    }),
    new Critters({
      // Outputs: <link rel="preload" onload="this.rel='stylesheet'">
      preload: 'swap',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '!!prerender-loader?string!./src/template.html',
      inject: 'head',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    new WebappWebpackPlugin(configureWebapp()),
    // new CreateSymlinkPlugin(commonPaths.createSymlinkConfig, true),
    new WorkboxPlugin.GenerateSW(configureWorkbox()),
    new BundleAnalyzerPlugin(configureBundleAnalyzer()),
    new CompressionPlugin({
      compressionOptions: {
        numiterations: 15,
      },
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback)
      },
    }),
  ],
  devtool: 'source-map',
}
