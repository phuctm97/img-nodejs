const express = require("express");
const { getScreenshot } = require("./server/chromium");
const { dayInSecs } = require("./utils/time");
const packageJSON = require("./package.json");

const v1 = {
  parseRequest: require("./server/v1/parser"),
  getHTML: require("./server/v1/template"),
};
const v2 = {
  parseRequest: require("./server/v2/parser"),
  getHTML: require("./server/v2/template"),
};

const app = express();
const port = process.env.PORT || 3000;
const browserOpts = {
  remoteBrowser: process.env.REMOTE_BROWSER,
  containerizedBrowser: process.env.CONTAINERIZED_BROWSER,
};
const isHTMLDebug = process.env.HTML_DEBUG === "1";
const cacheAge = 7 * dayInSecs;

const renderScreenshot = (res, screenshot, fileType) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", `image/${fileType}`);
  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=${cacheAge}, max-age=${cacheAge}`
  );
  res.end(screenshot);
};

const renderError = (res, err) => {
  res.statusCode = 500;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1>Internal Error</h1><p>Sorry, there was a problem.</p>");
  console.error(err);
};

const handler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => renderError(res, err));

app.get(
  "/api/v1/:slug",
  handler(async (req, res) => {
    const parsedReq = v1.parseRequest(req);
    const html = v1.getHTML(parsedReq, isHTMLDebug);
    if (isHTMLDebug) {
      res.setHeader("Content-Type", "text/html");
      res.end(html);
      return;
    }

    const { fileType } = parsedReq;
    const screenshot = await getScreenshot(html, fileType, browserOpts);
    renderScreenshot(res, screenshot, fileType);
  })
);

app.get(
  "/api/v2/:slug",
  handler(async (req, res) => {
    const parsedReq = v2.parseRequest(req);
    const html = v2.getHTML(parsedReq, isHTMLDebug);
    if (isHTMLDebug) {
      res.setHeader("Content-Type", "text/html");
      res.end(html);
      return;
    }

    const { fileType } = parsedReq;
    const screenshot = await getScreenshot(html, fileType, {
      ...browserOpts,
      width: parsedReq.width,
      height: parsedReq.height,
    });
    renderScreenshot(res, screenshot, fileType);
  })
);

app.get("*", (_, res) => {
  res.redirect(packageJSON.repository);
});

app.listen(port, () => {
  console.log(`started server, listening at ${port}.`);
});
