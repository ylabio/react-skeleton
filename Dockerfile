FROM node:18.18.1
RUN npm install -g ts-node
ADD typings /typings
ADD dist /dist
ADD node_modules /node_modules
ADD server /server
ADD tsconfig.json tsconfig.json
ADD package.json package.json
ADD proxy.config.ts proxy.config.ts
EXPOSE 3000
CMD [ "ts-node", "./server/index.ts" ]
