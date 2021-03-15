const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry:"./src/index.js",
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"boundle.js"
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:"./assets/index.html"
        })
    ]
}