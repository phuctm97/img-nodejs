const puppeteer = require("puppeteer-core");

const localExePath =
  (process.platform === "win32" &&
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe") ||
  (process.platform === "linux" && "/usr/bin/google-chrome") ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let cachedPage;

const getPage = async ({
  remoteBrowser = undefined,
  containerizedBrowser = undefined,
}) => {
  if (cachedPage) return cachedPage;

  const browser = await puppeteer.launch(
    (remoteBrowser && {
      browserWSEndpoint: remoteBrowser,
      headless: true,
    }) ||
      (containerizedBrowser && {
        executablePath: containerizedBrowser,
        args: ["--no-sandbox", "--disable-gpu"],
        headless: true,
      }) || {
        executablePath: localExePath,
        headless: true,
      }
  );
  cachedPage = await browser.newPage();

  return cachedPage;
};

const getScreenshot = async (
  html,
  type,
  {
    remoteBrowser = undefined,
    containerizedBrowser = undefined,
    width = 1200,
    height = 630,
  }
) => {
  const page = await getPage({ remoteBrowser, containerizedBrowser });
  await page.setViewport({ width, height });
  await page.setContent(html);
  return page.screenshot({ type });
};

module.exports = {
  getScreenshot,
};
