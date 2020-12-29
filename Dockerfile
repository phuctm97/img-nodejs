FROM node:12-alpine as builder
WORKDIR /app
COPY . .
RUN yarn
CMD ["yarn", "start"]
