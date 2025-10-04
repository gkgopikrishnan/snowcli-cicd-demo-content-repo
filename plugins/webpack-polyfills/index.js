const webpack = require('webpack');

module.exports = function webpackPolyfills() {
  return {
    name: 'webpack-polyfills',
    configureWebpack() {
      return {
        resolve: {
          fallback: {
            fs: false,
            stream: require.resolve('stream-browserify'),
            zlib: require.resolve('browserify-zlib'),
            buffer: require.resolve('buffer/'),
            process: require.resolve('process/browser'),
            assert: require.resolve('assert/'),
            util: require.resolve('util/'),
          },
        },
        plugins: [
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
          }),
        ],
      };
    },
  };
};
