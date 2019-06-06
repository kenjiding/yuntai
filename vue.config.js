var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var _ = require('lodash');
var getLocalIdent = require('css-loader/lib/getLocalIdent');
var StyleLintPlugin = require('stylelint-webpack-plugin');
var path = require('path');

var BASE_URL = process.env.VUE_APP_BASE_URL;
var OUTPUT_DIR = process.env.VUE_APP_OUTPUT_DIR;

var webpackPlugins = [];
if (process.env.NODE_ENV === 'production') {
  webpackPlugins.push(
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: false,
        },
      },
    })
  );
}

module.exports = {
  baseUrl: BASE_URL,
  outputDir: OUTPUT_DIR,
  devServer: {
    port: 80,
    proxy: process.env.VUE_APP_MOCK === 'true' ? process.env.VUE_APP_MOCK_URL : '',
    disableHostCheck: true,
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'black': '#000',
          'white': '#fff',
          'red': '#E54B5E',
          'gray': '#909399',
          'blue': '#077AFF',
          'orange': '#E6A23C',
          'green': '#67C23A',
          'text-color': '#333333',
          'button-primary-background-color': '#077AFF',
          'button-primary-border-color': '#077AFF',
          'button-bottom-action-default-background-color': '#077AFF',
        },
      },
    },
  },

  chainWebpack: config => {
    config
      .module
      .rule('scss')
      .oneOf('vue-modules')
      .use('css-loader')
      .tap(options => {
        options.localIdentName = '[name]__[local]-[hash:base64:5]';
        options.getLocalIdent = (context, localIdentName, localName, options) => {
          let name = localName;
          let resourcePath = context.resourcePath;
          let isIgnore = localName.indexOf('van');

          if (isIgnore > -1) {
            return name;
          }

          const cwdPath = process.cwd().split('/');
          const componentPath = resourcePath.split(_.last(cwdPath))[1].split('/');
          const isPage = componentPath.indexOf('views');

          name = getLocalIdent(context, localIdentName, localName, options);

          if (isPage > -1) {
            const tempPath = name.split('__');
            name = _.replace(name, tempPath[0], _.kebabCase(componentPath[isPage + 1]));
          }

          return name;
        };
        options.minimize = process.env.NODE_ENV === 'production';
        return options;
      });
  },

  configureWebpack: {
    plugins: webpackPlugins.concat([
      new StyleLintPlugin({
        configFile: path.join(__dirname, 'stylelint.config.js'),
        context: 'src',
        files: '**/*.(vue|scss)',
      }),
    ]),
  },
};
