#!/bin/bash

DIR=/home/ettienne/webapps/node

export METEOR_SETTINGS="$(cat $DIR/settings.json)"
export NODE_ENV=production
export ROOT_URL=http://test.invoice.tradehouse.as
export PORT=24198
