// process.traceDeprecation = true;
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const serverConfig = {
  entry: './server/server.tsx',

  target: 'node',

  externals: [nodeExternals()],

  output: {
    path: path.resolve('build'),
    filename: 'server.js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          allowTsInNodeModules: true,
          configFile: 'server.tsconfig.json'
        },
      },
      {
        test: /\.css$/i,
        use: ['css-loader'],
      },
      {
        test: /\.(png)$/,
        use: [{
          loader: 'file-loader',
          options: {
              name: '[md5:hash:hex].[ext]',
              publicPath: '/build/img',
              outputPath: 'img',
          }
      }]
      }
    ]
  },

  devtool: 'source-map',

  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.css', '.png' ],
  },
};

const clientConfig = {
  entry: './server/hydrate.tsx',

  target: 'web',

  output: {
    path: path.resolve('build'),
    filename: 'hydrate.js',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          allowTsInNodeModules: true,
          configFile: 'server.tsconfig.json'
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png)$/,
        use: [{
          loader: 'file-loader',
          options: {
              name: '[md5:hash:hex].[ext]',
              publicPath: '/build/img',
              outputPath: 'img',
          }
        }]
      }
    ]
  },

  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.css', '.png' ],
  },
};

module.exports = [serverConfig, clientConfig];
