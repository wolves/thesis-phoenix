var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, './assets/js/thesis.js'),
  output: {
    path: path.resolve(__dirname, './priv/static'),
    filename: 'thesis.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [
        path.resolve(__dirname, './node_modules/'),
        path.resolve(__dirname, './assets/vendor'),
      ],
      loader: 'babel-loader',
      query: {
        presets: [
          'es2016',
          'react',
        ]
      }
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
      }),
    },
    {
      test: /\.(sass|scss)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader'],
      }),
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'thesis.css',
      allChunks: true,
    })
  ],
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  }
};
