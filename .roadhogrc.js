const path = require('path');
var pxtorem = require('postcss-pxtorem');
export default {
    entry: "src/index.js",
    publicPath: "/xcx/",
    disableCSSModules: true,
    env: {
        development: {
            extraBabelPlugins: [
                "dva-hmr",
                "transform-runtime",
                ["import", { "libraryName": "antd-mobile", "style": true }]
            ],
            extraPostCSSPlugins: [
                pxtorem({
                    rootValue: 100,
                    propWhiteList: [],
                }),
            ]
        },
        production: {
            extraBabelPlugins: [
                "transform-runtime",
                ["import", { "libraryName": "antd-mobile", "style": true }],
            ],
            extraPostCSSPlugins: [
                pxtorem({
                    rootValue: 100,
                    propWhiteList: [],
                }),
            ]
        }
    },
    autoprefixer: {
        "browsers": [
            "iOS >= 8", "Android >= 4"
        ]
    }

}