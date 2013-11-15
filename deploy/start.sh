#!/bin/bash

#NODE=bin/node
NODE=bin/node
DIR=/home/ettienne/webapps/node
test -x "$DIR/$NODE" || exit 0

function start_app {

    export METEOR_SETTINGS="$(cat $DIR/settings.json)"
    export MONGO_URL="mongodb://prod:12Trade34@localhost:27018/invoice"

    export NODE_ENV=production
    export ROOT_URL=http://invoice.tradehouse.as
    export PORT=18203
    export MONGO_URL=mongodb://prod:12Trade34@localhost:22282/invoice

    nohup "$DIR/$NODE" "$DIR/bundle/main.js" 1>>"$DIR/log.log" 2>&1 &
    pidof "/home/ettienne/webapps/node/bin/node" > "$DIR/meteor.pid"
    #echo $! > "$DIR/meteor.pid"
}

function stop_app {
    kill `cat $DIR/meteor.pid`
}

case $1 in
    start)
        start_app ;;
    stop)
        stop_app ;;
    restart)
        stop_app
        start_app
        ;;
    *)
echo "usage: meteor {start|stop}" ;;
esac
exit 0


