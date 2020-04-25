var webpack = require('webpack');
var path = require('path');
var package = require('./package.json');

// variables
var isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';

console.log('isProduction = ', isProduction);

var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './build');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
	context: sourcePath,
	entry: {
		app: [
			'react',
			'react-dom',
			'react-hot-loader',
			'./index.tsx'
		]
	},
	output: {
		path: outPath,
		filename: isProduction ? '[contenthash].js' : '[hash].js',
		chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].[hash].js',
		publicPath: isProduction ? '' : '/'
	},
	target: 'web',
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		// Fix webpack's default behavior to not load packages with jsnext:main module
		// (jsnext:main directs not usually distributable es6 format, but es6 sources)
		mainFields: ['module', 'browser', 'main'],
		alias: {
			app: path.resolve(__dirname, 'src/app/'),
			$shared: path.resolve(__dirname, 'src/app/shared'),
			'~': path.resolve(__dirname, 'src/app/ui')
		}
	},
	module: {
		rules: [
			// .ts, .tsx
			{
				test: /\.tsx?$/,
				use: [
					isProduction && {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['react-hot-loader/babel']
						}
					},
					'ts-loader',
				].filter(Boolean)
			},
			// .js, .jsx
			{
				test: /\.(js|jsx)$/,
				use: [
					isProduction && {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				].filter(Boolean),
				exclude: {
					test: /core-js/,
				}
			},
			// css
			{
				test: /\.(css|sass)$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								mode: 'local',
								localIdentName: '[local]'
							}
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [
								require('postcss-import')({ addDependencyTo: webpack }),
								require('postcss-url')(),
								require('postcss-preset-env')({
									/* use stage 2 features (defaults) */
									stage: 2
								}),
								require('postcss-reporter')(),
								require('postcss-browser-reporter')({
									disabled: isProduction
								})
							]
						}
					}
				]
			},
			// static assets
			{ test: /\.html$/, use: 'html-loader' },
			{
				test: /\.(a?png|svg)$/,
				use: {
					loader: 'url-loader',
					options: { limit: 100000, publicPath: isProduction ? '' : '/' }
				}
			},
			{
				test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2|csv|json)$/,
				use: 'file-loader'
			}
		]
	},
	optimization: {
		splitChunks: {
			name: true,
			// maxSize: 200000,
			cacheGroups: {
				commons: {
					chunks: 'initial',
					minChunks: 2
				},
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
					filename: isProduction ? 'vendor.[contenthash].js' : 'vendor.[hash].js',
					priority: -10
				}
			}
		},
		runtimeChunk: true
	},
	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
			DEBUG: false,
			PRODUCTION: false,
			REACT_APP_ROUTER_BASE: ''
		}),
		new WebpackCleanupPlugin(),
		new MiniCssExtractPlugin({
			filename: '[hash].css',
			disable: !isProduction
		}),
		new HtmlWebpackPlugin({
			template: 'assets/index.html',
			minify: {
				minifyJS: true,
				minifyCSS: true,
				removeComments: true,
				useShortDoctype: true,
				collapseWhitespace: true,
				collapseInlineTagWhitespace: true
			},
			append: {
			},
			meta: {
				title: package.name,
				description: package.description,
				keywords: Array.isArray(package.keywords) ? package.keywords.join(',') : undefined
			},
			// favicon: 'assets/favicon.png',
			title: 'ACE'
		})
	],
	devServer: {
		port: '4000',
		host: '0.0.0.0',
		public: 'localhost:4000',
		hot: true,
		inline: true,
		historyApiFallback: {
			disableDotRule: true
		},
		stats: 'minimal',
		clientLogLevel: isProduction ? 'error' : 'warning'
	},
	// https://webpack.js.org/configuration/devtool/
	devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
	node: {
		// workaround for webpack-dev-server issue
		// https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
		fs: 'empty',
		net: 'empty'
	},
	performance: {
		maxEntrypointSize: 900000,
		maxAssetSize: 900000,
		hints: isProduction ? 'warning' : false
	}
};
