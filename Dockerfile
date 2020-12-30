FROM alpine:3.12

# Install dependencies to run Puppeteer in Alpine.
# See https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-on-alpine.
RUN apk add --no-cache \
        chromium \
        nss \
        freetype \
        freetype-dev \
        harfbuzz \
        ca-certificates \
        ttf-freefont \
        nodejs \
        yarn

# Setup app's dependencies and configure envs.
ENV CONTAINERIZED_BROWSER=/usr/bin/chromium-browser
ADD . /app/
WORKDIR /app/
RUN yarn

# Run everything as non-root user for security.
RUN addgroup -S appuser && adduser -S -g appuser appuser \
 && mkdir -p /home/appuser/Downloads /app/ \
 && chown -R appuser:appuser /home/appuser/ \
 && chown -R appuser:appuser /app/
USER appuser
CMD ["yarn", "start"]
