import path from 'path';
import webpack from 'webpack';

export default function webpackAliasesPlugin() {
  return {
    name: 'webpack-aliases-plugin',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            'process/browser': path.resolve(__dirname, '../node_modules/process/browser.js'),
          },
          fallback: {
            fs: false,
            stream: require.resolve('stream-browserify'),
            zlib: require.resolve('browserify-zlib'),
            buffer: require.resolve('buffer/'),
            process: require.resolve('process/browser.js'),
          },
        },
        plugins: [
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: path.resolve(__dirname, '../node_modules/process/browser.js'),
          }),
        ],
      };
    },
  };
}
