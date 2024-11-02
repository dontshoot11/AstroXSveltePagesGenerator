module.exports = {
	plugins: [
		require("postcss-nested"),
		require("autoprefixer")({
			overrideBrowserslist: [
				"defaults",
				"last 2 versions",
				"iOS >= 10",
				"Safari >= 10",
			],
		}),
	],
};
