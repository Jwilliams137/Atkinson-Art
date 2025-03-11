module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    // Enable the new JSX Transform
    ["@babel/plugin-transform-react-jsx", { "runtime": "automatic" }],
  ],
};
