const path = require("path");
const { readFileSync } = require("fs");
const HTMLPlugin = require("html-webpack-plugin");
const CSSPlugin = require("mini-css-extract-plugin");

// vendors:{
//   name:string:{
//     vendor: string separated by coma,
//     ...settings
//   }
// }
//excule: regExp or array of string
//defaultSettings: object
//other: string|falsethy
function createVendors(config = {}) {
  const {
    vendors,
    exclude,
    defaultSettings = { chunks: "all", filename: "[name].vendor.js" },
    other = "defaultVendor",
  } = config;
  const separateSign = /\s*,\s*/;
  const filter = (e) => {
    return (
      e &&
      (!exclude
        ? true
        : exclude instanceof RegExp
        ? !exclude.test(e)
        : !exclude.includes(e))
    );
  };
  const extractVendors = (v) => v.split(separateSign).filter(filter);
  const isEmpty = (t) => {
    if (Array.isArray(t)) return !Boolean(t.length);
    else if (typeof t === "object") return !Boolean(Object.keys(t).length);
    else return !Boolean(t);
  };
  const nodePrefix = String.raw`[\\/]node_modules[\\/]`;
  //look for module in pakage.json, use vendors for grouping
  let vendorList = Object.keys(
    JSON.parse(readFileSync("./package.json")).dependencies
  ).filter(filter);
  let out = {};
  if (isEmpty(vendors)) {
    if (other) {
      let pattern = nodePrefix;
      if (vendorList.length)
        pattern += String.raw`(${vendorList.join("|")})[\\/]`;
      out[other] = {
        test: new RegExp(pattern),
        ...defaultSettings,
        name: other,
        reuseExistingChunk: true,
      };
    }
  } else {
    let cachedVendors = [];
    out = Object.keys(vendors).reduce((prev, cur) => {
      const { vendor, ...settings } = vendors[cur];
      if (!vendor)
        throw new Error(
          "Structure not match: {vendors: {vendorName: {vendor: string, ...settings}}}"
        );
      let pattern = nodePrefix;
      const subVendorList = extractVendors(vendor);
      cachedVendors.push(...subVendorList);
      if (subVendorList.length)
        pattern += String.raw`(${subVendorList.join("|")})[\\/]`;
      // console.log(pattern)
      prev[cur] = {
        test: new RegExp(pattern),
        ...defaultSettings,
        name: cur,
        ...settings,
      };
      return prev;
    }, {});
    if (other) {
      let pattern = nodePrefix;
      if (cachedVendors.length < vendorList.length) {
        pattern += String.raw`(${vendorList
          .filter((v) => !cachedVendors.includes(v))
          .join("|")})[\\/]`;
      }
      out[other] = {
        test: new RegExp(pattern),
        ...defaultSettings,
        name: other,
        reuseExistingChunk: true,
      };
    }
  }
  if (isEmpty(out)) console.warn("No venders is needed");
  console.log(out);
  return out;
}

module.exports = {
  entry: ["./src/styles/main.scss", "./src/index.ts"],
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/assets/",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".ts", "..."],
    alias: {
      Fonts: path.resolve(__dirname, "src/fonts/"),
      Images: path.resolve(__dirname, "src/images/"),
      Styles: path.resolve(__dirname, "src/styles/"),
      Scripts: path.resolve(__dirname, "src/scripts/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          CSSPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: { outputStyle: "expanded" },
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: "asset/resource",
        use: [
          {
            loader: "file-loader",
            options: { name: "[path]/[name].[ext]" },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                quality: [50],
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HTMLPlugin({ template: "src/index.html", filename: "index.html" }),
    new CSSPlugin({ filename: "styles/index.css" }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        ...createVendors({
          vendors: {
            react: {
              vendor: "react, react-dom",
            },
            otherLibs: {
              vendor: "lodash",
              name: "otherlib",
            },
          },
        }),
      },
    },
  },
};
