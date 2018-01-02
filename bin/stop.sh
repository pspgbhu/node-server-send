#!/bin/bash
# stop.sh

##stop
stop(){
  echo "Stopping pm2"
  pm2 stop all
  pm2 delete all
}

##stop
stop
exit 0
