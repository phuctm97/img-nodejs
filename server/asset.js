const path = require("path");
const { readFileSync } = require("fs");

const fontsDir = path.resolve(__dirname, "..", "fonts");
const imagesDir = path.resolve(__dirname, "..", "images");

const readFont = (name) => readFileSync(path.join(fontsDir, name), "base64");
const readImage = (name) => readFileSync(path.join(imagesDir, name), "base64");

module.exports = {
  readFont,
  readImage,
};
