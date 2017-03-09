const path = require('path'),
	  webpack = require('webpack');

module.exports = {
	devtool: 'cheap-source-map',
	entry: './src/js/main.js',
	output: {
		filename: 'main.min.js',
		path: path.resolve(__dirname, 'public/js')
	},
	module: {
		rules: [
			{
				test: /\.js$/, 
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.BannerPlugin('A simple caculator created by yuyang')
	]
};