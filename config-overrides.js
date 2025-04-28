const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer/"),
    "util": false, // Using false instead of util/ to avoid the error
    "https": require.resolve("https-browserify"),
    "http": require.resolve("stream-http"),
    "querystring": require.resolve("querystring-es3"),
    "url": require.resolve("url/"),
    "path": require.resolve("path-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "assert": require.resolve("assert/"),
    "vm": require.resolve("vm-browserify"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  );

  return config;
};