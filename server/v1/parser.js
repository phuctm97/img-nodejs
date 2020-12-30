const { getNameAndExt, getStringArray } = require("../../utils/primitive");

const parseRequest = (req) => {
  const { params, query } = req;
  const { slug } = params;
  const { fontSize, images, widths, heights, theme, md } = query;

  if (Array.isArray(slug)) throw new Error("Expected a single slug.");
  if (Array.isArray(fontSize)) throw new Error("Expected a single fontSize.");
  if (Array.isArray(theme)) throw new Error("Expected a single theme.");

  const [text, ext] = getNameAndExt(slug);
  const parsedReq = {
    fileType: ext === "jpeg" || ext === "jpg" ? "jpeg" : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    md: md === "1" || md === "true",
    fontSize: fontSize || "6.5rem",
    images: getStringArray(images),
    widths: getStringArray(widths),
    heights: getStringArray(heights),
  };
  return parsedReq;
};

module.exports = parseRequest;
