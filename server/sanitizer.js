const sanitizedTokens = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};

const sanitizeHtml = (html) =>
  String(html).replace(/[&<>"'\/]/g, (key) => sanitizedTokens[key]);

module.exports = {
  sanitizeHtml,
};
