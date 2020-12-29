const puppeteer = require("puppeteer-core");

const localExePath =
  (process.platform === "win32" &&
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe") ||
  (process.platform === "linux" && "/usr/bin/google-chrome") ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let cachedPage;

const getPage = async (browserWSEndpoint = undefined) => {
  if (cachedPage) return cachedPage;

  const browser = await puppeteer.launch(
    browserWSEndpoint
      ? {
          args: [],
          executablePath: localExePath,
          headless: true,
        }
      : {
          browserWSEndpoint: `ws://${browserWSEndpoint}`,
          headless: true,
        }
  );
  cachedPage = await browser.newPage();

  return cachedPage;
};

const getScreenshot = async (
  html,
  type,
  { browserWSEndpoint = undefined, width = 1200, height = 630 }
) => {
  const page = await getPage(browserWSEndpoint);
  await page.setViewport({ width, height });
  await page.setContent(html);
  return page.screenshot({ type });
};

module.exports = {
  getScreenshot,
};
