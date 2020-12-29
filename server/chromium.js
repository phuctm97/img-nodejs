const puppeteer = require("puppeteer");

let cachedPage;

const getPage = async () => {
  if (cachedPage) return cachedPage;

  const browser = await puppeteer.launch();
  cachedPage = await browser.newPage();

  return cachedPage;
};

const getScreenshot = async (html, type, { width = 1200, height = 630 }) => {
  const page = await getPage();
  await page.setViewport({ width, height });
  await page.setContent(html);
  return page.screenshot({ type });
};

module.exports = {
  getScreenshot,
};
