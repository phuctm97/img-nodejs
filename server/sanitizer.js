const sanitizedTokens = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};

const sanitizeHTML = (html) =>
  String(html).replace(/[&<>"'\/]/g, (key) => sanitizedTokens[key]);

module.exports = {
  sanitizeHTML,
};
