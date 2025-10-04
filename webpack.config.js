const webpack = require('webpack');

module.exports = {
  resolve: {
    alias: {
      'process/browser': require.resolve('process/browser.js'), // ✅ force alias to .js
    },
    fallback: {
      fs: false,
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser.js'), // still needed for other imports
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: require.resolve('process/browser.js'), // ✅ provide correct path
    }),
  ],
};
