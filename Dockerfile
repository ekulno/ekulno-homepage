FROM node:22-alpine3.19


WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn

COPY public /usr/src/app/public
COPY src /usr/src/app/src
COPY server /usr/src/app/server
COPY server.tsconfig.json /usr/src/app
COPY webpack.js /usr/src/app

RUN yarn prod:build

CMD node build/server.js