import path, { resolve as _resolve } from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
