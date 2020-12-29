const getStringArray = (stringOrArray) => {
  if (typeof stringOrArray === "undefined") return [];
  if (Array.isArray(stringOrArray)) return stringOrArray;
  return [stringOrArray];
};

module.exports = { getStringArray };
