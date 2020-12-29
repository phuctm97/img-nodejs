const path = require("path");
const { readFileSync } = require("fs");
const marked = require("marked");
const twemoji = require("twemoji");
const simpleIcons = require("simple-icons");

const emojify = (text) => twemoji.parse(text, { folder: "svg", ext: ".svg" });

const fontsDir = path.join(process.cwd(), "fonts");
const readFont = (name) =>
  readFileSync(path.join(fontsDir, name)).toString("base64");

const rglr = readFont("Inter-Regular.woff2");
const bold = readFont("Inter-Bold.woff2");
const mono = readFont("Vera-Mono.woff2");
const avatar = readFileSync(
  path.join(process.cwd(), "images", "avatar.jpg"),
  "base64"
);

const getCss = (
  theme,
  { fontSize = 10, width = 1200, height = 630, marginTop = 2, marginBottom = 2 }
) => {
  let background = "white";
  let foreground = "black";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "black";
    foreground = "white";
    radial = "dimgray";
  }
  return `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: bold;
      src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }
    @font-face {
      font-family: 'Vera';
      font-style: normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${mono}) format("woff2");
    }
    html {
      font-size: ${fontSize}px;
    }
    html, body {
      margin: 0;
      padding: 0;
    }
    body {
      background: ${background};
      font-family: 'Inter', sans-serif;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: ${background};
      background-image: radial-gradient(circle at 1.5rem 1.5rem, ${radial} 2%, transparent 0%), radial-gradient(circle at 5rem 5rem, ${radial} 2%, transparent 0%);
      background-size: 6.5rem 6.5rem;
      width: ${width}px;
      height: ${height}px;
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      justify-content: center;
    }
    main {
      flex: 1;
      margin: ${marginTop}rem 3rem 0 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    footer {
      position: relative;
      bottom: ${marginBottom}rem;
    }
    code {
      color: #d400ff;
      font-family: 'Vera';
      white-space: pre-wrap;
      letter-spacing: -0.32rem;
    }
    code:before, code:after {
      content: '\`';
    }
    .logo-wrapper {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      justify-items: center;
    }
    .logo {
      height: 16rem;
      margin: 0 4.5rem;
    }
    .plus {
      color: #bbb;
      font-family: Times New Roman, Verdana;
      font-size: 6.25rem;
    }
    .emoji {
      height: 1em;
      width: 1em;
      margin: 0 .05em 0 .1em;
      vertical-align: -0.1em;
    }
    .heading {
      font-family: 'Inter', sans-serif;
      font-size: 6.5rem;
      font-style: normal;
      color: ${foreground};
      line-height: 1.65;
    }
    .heading p {
      margin: 2rem 0;
    }
    footer p {
      font-size: 2rem;
      color: ${theme === "light" ? "#9ca3af" : "#6b7280"};
    }
    footer .avatar {
      border-radius: 100%;
      height: 2.25em;
      margin-bottom: -0.5em;
    }
    footer .link {
      color: #2563eb;
    }
    footer p svg {
      height: 1.7em;
      margin-bottom: -0.3em;
    }`;
};

const getLogo = (name, color) => {
  const logo = simpleIcons.get(name);
  if (!logo) return;

  const fill =
    (color && color !== "invert" && color !== "default" && color) ||
    `#${logo.hex}`;
  const filter = color === "invert" ? "invert(100%)" : "none";
  return `<svg role="img" class="logo" fill="${fill}" style="filter:${filter};" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <title>${logo.title}</title>
    <path d="${logo.path}" />
  </svg>`;
};

const getPlusSign = (i) => (i === 0 ? "" : '<div class="plus">+</div>');

const getHtml = (req) => {
  const {
    text,
    theme,
    fontSize,
    width,
    height,
    marginTop,
    marginBottom,
    icons,
    colors,
  } = req;
  return `<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(theme, { fontSize, width, height, marginTop, marginBottom })}
  </style>
  <body>
    <div class="container">
    <main>
      <div class="logo-wrapper">
        ${icons
          .map((icon, i) => getLogo(icon, colors[i]))
          .filter((icon) => !!icon)
          .map((icon, i) => getPlusSign(i) + icon)
          .join("")}
      </div>
      <div class="heading">${emojify(marked(text))}</div>
    </main>
    <footer>
      <p>(
        By <img class="avatar" alt="Minh-Phuc Tran" src="data:image/jpeg;charset=utf-8;base64,${avatar}"/>
        <strong>Minh-Phuc Tran</strong>
        at ${emojify("🔗")} <strong class="link">phuctm97.com</strong>
        and <strong class="link"><span style="font-size:1.25em">@</span>phuctm97</strong> on
        <svg role="img" fill="#1da1f2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
        + <svg role="img" fill="${
          theme === "light" ? "#181717" : "white"
        }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        + <svg viewBox="0 0 235 234" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="rainbow-logo" preserveAspectRatio="xMinYMin meet"> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="80K"> <polygon id="Shape" fill="#88AEDC" points="234.04 175.67 158.35 233.95 205.53 233.95 234.04 212"></polygon> <polygon id="Shape" points="234.04 140.06 112.11 233.95 112.13 233.95 234.04 140.08"></polygon> <polygon id="Shape" points="133.25 0.95 0.04 103.51 0.04 103.53 133.27 0.95"></polygon> <polygon id="Shape" fill="#F58F8E" fill-rule="nonzero" points="0.04 0.95 0.04 31.11 39.21 0.95"></polygon> <polygon id="Shape" fill="#FEE18A" fill-rule="nonzero" points="39.21 0.95 0.04 31.11 0.04 67.01 85.84 0.95"></polygon> <polygon id="Shape" fill="#F3F095" fill-rule="nonzero" points="85.84 0.95 0.04 67.01 0.04 103.51 133.25 0.95"></polygon> <polygon id="Shape" fill="#55C1AE" fill-rule="nonzero" points="133.27 0.95 0.04 103.53 0.04 139.12 179.49 0.95"></polygon> <polygon id="Shape" fill="#F7B3CE" fill-rule="nonzero" points="234.04 0.95 226.67 0.95 0.04 175.45 0.04 211.38 234.04 31.2"></polygon> <polygon id="Shape" fill="#88AEDC" fill-rule="nonzero" points="179.49 0.95 0.04 139.12 0.04 175.45 226.67 0.95"></polygon> <polygon id="Shape" fill="#F58F8E" fill-rule="nonzero" points="234.04 31.2 0.04 211.38 0.04 233.95 18.07 233.95 234.04 67.65"></polygon> <polygon id="Shape" fill="#FEE18A" fill-rule="nonzero" points="234.04 67.65 18.07 233.95 64.7 233.95 234.04 103.56"></polygon> <polygon id="Shape" fill="#F3F095" fill-rule="nonzero" points="234.04 103.56 64.7 233.95 112.11 233.95 234.04 140.06"></polygon> <polygon id="Shape" fill="#55C1AE" fill-rule="nonzero" points="234.04 140.08 112.13 233.95 158.35 233.95 234.04 175.67"></polygon> <polygon id="Shape" fill="#F7B3CE" fill-rule="nonzero" points="234.04 212 205.53 233.95 234.04 233.95"></polygon> <g id="Group" transform="translate(37.000000, 77.000000)" fill="#FFFFFF"> <path d="M28.2371517,0.75 C32.7510836,1.7 36.0111455,3.55 39.371517,7.05 C42.4309598,10.25 44.3368421,13.9 45.1393189,18 C45.7913313,21.45 45.7913313,58.55 45.1393189,62.05 C43.4340557,71.15 35.6600619,78.25 26.0303406,79.5 C24.0241486,79.75 17.3034056,80 11.1845201,80 L-7.10542736e-15,80 L-7.10542736e-15,1.42108547e-14 L12.4383901,1.42108547e-14 C21.2656347,1.42108547e-14 25.7795666,0.2 28.2371517,0.75 Z M14.5448916,40 L14.5448916,65.6 L19.7108359,65.4 C24.174613,65.25 25.1275542,65.05 27.1337461,63.9 C31.0458204,61.6 31.0959752,61.45 31.0959752,39.7 C31.0959752,18.5 31.0959752,18.5 27.4346749,16.1 C25.6291022,14.9 24.8767802,14.75 19.9616099,14.55 L14.5448916,14.4 L14.5448916,40 Z" id="Combined-Shape"></path> <path d="M93.7894737,7.25 L93.7894737,14.5 L68.2105263,14.5 L68.2105263,32.5 L83.7585139,32.5 L83.7585139,47 L68.2105263,47 L68.3108359,56.1 L68.4613003,65.25 L81.1504644,65.4 L93.7894737,65.5 L93.7894737,80 L78.993808,80 C62.5430341,80 59.9851393,79.7 57.3770898,77.4 C53.7157895,74.2 53.9164087,76.25 53.7659443,41.1 C53.6656347,19.2 53.8160991,8.85 54.1671827,7.45 C54.8693498,4.85 57.828483,1.65 60.4365325,0.75 C61.9913313,0.2 65.9034056,0.05 78.1411765,4.26325641e-14 L93.7894737,4.26325641e-14 L93.7894737,7.25 Z" id="Path"></path> <path d="M125.437152,28.1 C129.148607,42.35 132.258204,53.7 132.358514,53.35 C132.508978,53 135.668731,40.95 139.430341,26.5 L146.301548,0.25 L154.125697,0.1 C160.043963,7.10542736e-15 162,0.15 162,0.6 C162,1.05 144.64644,66.8 143.643344,70.1 C142.941176,72.4 139.179567,77.1 137.073065,78.35 C134.414861,79.85 130.502786,80.1 128.095356,78.85 C125.9387,77.75 123.079876,74.45 121.625387,71.35 C120.722601,69.45 105.97709,15.35 102.566563,1.35 L102.21548,0 L110.039628,0 C117.713313,0 117.913932,0 118.31517,1.1 C118.515789,1.75 121.725697,13.9 125.437152,28.1 Z" id="Path"></path> </g> </g> </g> </svg>
        + <svg fill="none" viewBox="0 0 337 337"><rect x="113" y="113" width="111" height="111" rx="55.5" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.155 112.598c-30.873 30.874-30.873 80.93 0 111.804l89.443 89.443c30.874 30.873 80.93 30.873 111.804 0l89.443-89.443c30.873-30.874 30.873-80.93 0-111.804l-89.443-89.443c-30.874-30.873-80.93-30.873-111.804 0l-89.443 89.443zm184.476 95.033c21.612-21.611 21.612-56.651 0-78.262-21.611-21.612-56.651-21.612-78.262 0-21.612 21.611-21.612 56.651 0 78.262 21.611 21.612 56.651 21.612 78.262 0z" fill="#2962FF"/></svg>
      )</p>
    </footer>
    </div>
  </body>
</html>`;
};

module.exports = {
  getHtml,
};
