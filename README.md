# 🌌 Imagegen as a Service (Node.js)

Imagegen (image generator) as a Service, built with Node.js and DigitalOcean.

[![Deploy to DO](https://mp-assets1.sfo2.digitaloceanspaces.com/deploy-to-do/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/phuctm97/img-node/tree/master)

## What is this?

This is an API that generates dynamic images for different purposes, is especially useful to generate cover images for distributing content:

- Blogging & writing.

- Videos' thumbnails.

- Open-source repositories' social images.

- etc.

It's built with Node.js and configured to deploy to [DigitalOcean App Platform] with a single click, no setup required, no server to maintain.

## How should you use it?

DigitalOcean is charging my credits, so feel free to test the API on my website but please don't use it directly on yours. Instead:

- [Fork the repository](https://github.com/phuctm97/img-node/fork).

- Make changes to fit your need (see below, it's easy).

- Update the Deploy to DigitalOcean button's link to point to **your forked repository**.

- Click it and deploy 🚀.

## API

### V1

Generic, non-personalized, fewer features.

**URL**: `GET /api/v1/[slug]`

**Query params**:

```yml
text: string.(png|jpg);
theme: "light" | "dark";
md: boolean; # Enable basic Markdown syntax or not.
fontSize: string;
images: string[];
widths: string[];
heights: string[];
```

All query params are optional, a reasonable default will be used when necessary.

### V2

Personalized, more features.

**URL**: `GET /api/v2/[slug]`

**Query params**:

```yml
text: markdown.(png|jpg);
target: "devto" | "og";
theme: "light" | "dark";
icons: string[];
colors: string[];
```

- **text** supports Markdown syntax by default. Emojis are replaced with [Twemoji].

- **icons** are loaded from [Simple Icons], use names appearing on its website as inputs here. Not found icons will be ignored.

- **colors** are valid CSS colors, or `default` to use Simple Icons' suggested colors, or `invert` to invert the default colors.

- **target** helps generate images suitable for distribution to a specific platform, currently supports DEV.to (`devto`) and Open Graph (`og`).

All query params are optional, a reasonable default will be used when necessary.

**Example**:

```
https://{DOMAIN}/api/v2/%F0%9F%8E%86%20**Imagegen**%20as%20a%20Service?&icons=Node.js&icons=DigitalOcean
```

## Project structure

The project uses [Puppeteer] to launch and capture screenshots from a headless Chrome. Responses are cached for 7 days to increase performance and reduce loads.

- **server/v1**: parse API v1 requests and generate static HTML.

  - Change `parser.js` to update query API.
  - Change `template.js` to customize output images.

- **server/v2**: parse API v2 requests and generate static HTML.

  - Change `parser.js` to update query API.
  - Change `template.js` to customize output images.

- **images/avatar.jpg**: author's avatar used in V2. Replace with yours.

- **server/\*.js**: utils to process HTML and capture screenshots.

- **index.js**: Express.js routes to receive requests (you probably won't need to change this).

- **fonts**: Fonts are loaded locally in **server/\*\*/\*.js**. Replace with your fonts (optionally).

**Recommended approach**: copy **index.js**`#/api/v1` + **server/v1** (or **index.js**`#/api/v2` + **server/v2**) to v3, then make changes arcordingly. It won't accidentially crash your code this way.

## Author

Made by ([@phuctm97]).

## Thanks

Heavily inspired by Vercel's [og-image].

<!-- Links -->

[@phuctm97]: https://twitter.com/phuctm97
[simple icons]: https://simpleicons.org
[digitalocean app platform]: https://www.digitalocean.com/products/app-platform
[twemoji]: https://twemoji.twitter.com
[og-image]: https://github.com/vercel/og-image
[puppeteer]: https://github.com/puppeteer/puppeteer
