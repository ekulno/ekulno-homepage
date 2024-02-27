FROM node:21-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn

COPY src /usr/src/app/src
COPY tsconfig.json /usr/src/app

RUN yarn build

COPY assets /usr/src/app/assets

CMD node lib/index.js