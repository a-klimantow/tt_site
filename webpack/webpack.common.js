const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = ['index', 'about', 'versions-history', 'contacts'];

module.exports = {
	entry: {
		app: Path.resolve(__dirname, '../src/scripts/index.js')
	},
	output: {
		path: Path.join(__dirname, '../build'),
		filename: 'js/[name].js'
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			name: false
		}
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{ from: Path.resolve(__dirname, '../public'), to: 'public' }
		]),
	].concat(pages.map(page => (
		new HtmlWebpackPlugin({
			template: Path.resolve(__dirname, `../src/${page}.pug`),
			filename: page + '.html'
		})
	))),
	resolve: {
		alias: {
			'~': Path.resolve(__dirname, '../src')
		}
	},
	module: {
		rules: [
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto'
			},
			{
				test: /\.pug$/,
				use: ['pug-loader']
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]'
					}
				}
			},
		]
	}
};
