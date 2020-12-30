const getStringArray = (stringOrArray) => {
  if (typeof stringOrArray === "undefined") return [];
  if (Array.isArray(stringOrArray)) return stringOrArray;
  return [stringOrArray];
};

const getNameAndExt = (str) => {
  const parts = str.split(".");
  let ext = "";
  let text = "";
  if (parts.length === 0) {
    text = "";
  } else if (parts.length === 1) {
    text = parts[0];
  } else {
    ext = parts.pop() || "";
    text = parts.join(".");
  }
  return [text, ext];
};

module.exports = {
  getStringArray,
  getNameAndExt,
};
