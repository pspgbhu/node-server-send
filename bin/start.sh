#!/bin/bash
# start.sh

# npm install
npm install
# echo $BASEDIR
echo 'Starting PM2'
# pm2 start "$BASEDIR"/config.prod.json
npm start
