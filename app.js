const express = require("express");
const { getScreenshot } = require("./server/chromium");
const { dayInSecs } = require("./utils/time");
const { parseRequest: parseRequestV1 } = require("./server/v1/parser");
const { getHtml: getHtmlV1 } = require("./server/v1/template");
const { parseRequest: parseRequestV2 } = require("./server/v2/parser");
const { getHtml: getHtmlV2 } = require("./server/v2/template");

const app = express();
const port = process.env.PORT || 4000;
const isHTMLDebug = process.env.HTML_DEBUG === "1";
const cacheAge = 7 * dayInSecs;

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get(
  "/api/v1/:slug",
  asyncHandler(async (req, res) => {
    try {
      const parsedReq = parseRequestV1(req);
      const html = getHtmlV1(parsedReq, isHTMLDebug);
      if (isHTMLDebug) {
        res.setHeader("Content-Type", "text/html");
        res.end(html);
        return;
      }

      const { fileType } = parsedReq;
      const screenshot = await getScreenshot(html, fileType, {});
      res.statusCode = 200;
      res.setHeader("Content-Type", `image/${fileType}`);
      res.setHeader(
        "Cache-Control",
        `public, immutable, no-transform, s-maxage=${cacheAge}, max-age=${cacheAge}`
      );
      res.end(screenshot);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/html");
      res.end("<h1>Internal Error</h1><p>Sorry, there was a problem.</p>");
      console.error(err);
    }
  })
);

app.get(
  "/api/v2/:slug",
  asyncHandler(async (req, res) => {
    try {
      const parsedReq = parseRequestV2(req);
      const html = getHtmlV2(parsedReq, isHTMLDebug);
      if (isHTMLDebug) {
        res.setHeader("Content-Type", "text/html");
        res.end(html);
        return;
      }

      const { fileType } = parsedReq;
      const screenshot = await getScreenshot(html, fileType, {
        width: parsedReq.width,
        height: parsedReq.height,
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", `image/${fileType}`);
      res.setHeader(
        "Cache-Control",
        `public, immutable, no-transform, s-maxage=${cacheAge}, max-age=${cacheAge}`
      );
      res.end(screenshot);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/html");
      res.end("<h1>Internal Error</h1><p>Sorry, there was a problem.</p>");
      console.error(err);
    }
  })
);

app.get("*", (_, res) => {
  res.redirect("https://github.com/phuctm97/img-node");
});

app.listen(port, () => {
  console.log(`started server, listening at ${port}.`);
});
