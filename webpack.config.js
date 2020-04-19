// this will change based on whether you run npm run dev npm run build
const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MinifyCss = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra');


const postCssPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-hexrgba'),
    require('autoprefixer')
];

// for images
class RunAfterCompile {
    apply(compiler) {
      compiler.hooks.done.tap('Copy images', function() {
        // where the images are from, where the images will output
        fse.copySync('./app/assets/images', './docs/assets/images')
      })
    }
  }


// main css config file
let cssConfig = {
    // webpack look for css files
    test: /\.css$/i,
    // when you find css files do this
    use: ['css-loader?url=false', {
        loader: 'postcss-loader',
        options: {
            plugins: postCssPlugins    
        }
    }]
}


// for multiple html files
let pages = fse.readdirSync('./app').filter(function(file) {
    return file.endsWith('.html')
  }).map(function(page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`
    })
  })

// main config for both production and dev
let config = {
    // where webpack looks initially
    entry: './app/assets/scripts/App.js',
    plugins: pages,
    module: {
        rules: [
            cssConfig,
            {
              test: /\.(js|jsx)$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-react','@babel/preset-env']
                }
              }
            }
        ]
    }

};


// this is what will run when you are working on a site
if(currentTask == 'dev') {
    cssConfig.use.unshift('style-loader');
    config.output = {
        // new name of bundled js
        filename: 'bundled.js',
        // so that the file sits next to the index file
        path: path.resolve(__dirname, 'app')
    }

    config.devServer = {
        before: function (app, server) {
            server._watch('./app/**/*.html')
        },
        // where the server will look
        contentBase: path.join(__dirname, 'app'),
        // allows reload
        hot: true,
        // show errors in browser
        overlay: true,
        // localhost
        port: 3000,
        host: '0.0.0.0'
    };

    config.mode = 'development';

    // for viewing errors also check 
    // if it causes problems
    config.devtool = 'eval-source-map';
}


// when you run npm build to publish a site this will happen
if(currentTask == 'build') {

    cssConfig.use.unshift(MinifyCss.loader);
    postCssPlugins.push(require('cssnano'));
    config.output = {
        // new name of bundled js
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        // so that the file sits next to the index file
        path: path.resolve(__dirname, 'docs')
    };

    config.mode = 'production';

    config.devtool = 'source-map';

    config.optimization = {
        splitChunks: {chunks: 'all'}
    };

    config.plugins.push(
        new CleanWebpackPlugin(),
        new MinifyCss({
            filename: 'styles.[chunkhash].css'
            }),
        new RunAfterCompile()    
        );
}



module.exports = config