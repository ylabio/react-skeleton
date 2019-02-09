#!/usr/bin/env bash

#rm -r dist
#mkdir dist

rm -r dist/assets
rm dist/*.js
rm dist/*.json
npm install
npm run build-prod-ssr
