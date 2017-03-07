// 仅负责模块化JS， 其他的交给gulp去做。
// 此项目不一定需要模块化，但mocha测试需要，故此引入
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
	}
	// plugins: [
	// 	new webpack.optimize.UglifyJsPlugin(),
	// 	new webpack.BannerPlugin('A simple caculator created by yuyang')
	// ]
};