#!/usr/bin/bash
pwd=$(pwd)

yarn

yarn gen-proto

rm -rf dist

yarn build

pm2 start dist/src/main.js --name euc_backend

# pm2 restart euc_backend --update-env
