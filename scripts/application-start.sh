#!/usr/bin/env bash
source $HOME/.bashrc

echo "[API] Starting deploy script"

echo "[API] Use node 6"
# install deps
#nvm install 6
nvm use default


echo "[API] Set variables"
# set variables
DATE=$(date +"%Y%m%d%H%M")
API_DIR=/opt/api
DEPLOY_DIR=$API_DIR/deploy/bundle
RELEASES_DIR=$API_DIR/releases
CURRENT_DIR=$API_DIR/current
BUILD_DIR=$RELEASES_DIR/$DATE

echo "[API] Copy from $DEPLOY_DIR to $BUILD_DIR"
# copy to new dir
cp -R $DEPLOY_DIR $BUILD_DIR


echo "[API] Remove old symlink"
# remove old symlinke
cd $API_DIR && rm current

echo "[API] Create new symlink in $BUILD_DIR/current"
# create new proper symlink
cd $API_DIR && ln -s $BUILD_DIR current

#echo "[API] Update pm2"
#npm install pm2@latest -g ; pm2 update
echo "[API] Delete all prevs processes"

echo "[API] Start new process"
# start new
NODE_ENV=$NODE_ENV COLOR_SCRIPT=$CURRENT_DIR/www COLOR_CWD=$CURRENT_DIR pm2 startOrRestart $CURRENT_DIR/start.json

#cleanup
echo "[API] Cleaning old folders"
cd $RELEASES_DIR/ && find * ! -name $DATE -maxdepth 0 -type d -exec rm -rf {} +
echo "[API] Cleaning completed"