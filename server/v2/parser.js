const { getNameAndExt, getStringArray } = require("../../utils/primitive");

const presets = {
  og: { width: 1200, height: 630, fontSize: 10, marginTop: 2, marginBottom: 2 },
  devto: {
    width: 1000,
    height: 420,
    fontSize: 8,
    marginTop: 0.8,
    marginBottom: 0.8,
  },
};

const parseRequest = (req) => {
  const { params, query } = req;
  const { slug } = params;
  const { theme, target, icons, colors } = query;

  if (Array.isArray(slug)) throw new Error("Expected a single slug.");
  if (Array.isArray(theme)) throw new Error("Expected a single theme.");
  if (Array.isArray(target)) throw new Error("Expected a single target.");

  const [text, ext] = getNameAndExt(slug);
  const preset = presets[target || ""] || presets.og;

  const parsedReq = {
    ...preset,
    fileType: ext === "jpeg" || ext === "jpg" ? "jpeg" : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    icons: getStringArray(icons),
    colors: getStringArray(colors),
  };
  return parsedReq;
};

module.exports = parseRequest;
