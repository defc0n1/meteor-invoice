#!/bin/bash

NODE=bin/node
DIR=/home/ettienne/webapps/node
STAGEDIR=/home/ettienne/webapps/staging
test -x "$DIR/$NODE" || exit 0


function start_app {
    source "$DIR/prod.sh"
    nohup "$DIR/$NODE" "$DIR/bundle/main.js" 1>>"$DIR/log.log" 2>&1 &
    pidof "$DIR/$NODE" > "$DIR/meteor.pid"
}
function start_stage {
    source "$STAGEDIR/staging.sh"
    nohup "$STAGEDIR/$NODE" "$STAGEDIR/bundle/main.js" 1>>"$STAGEDIR/log.log" 2>&1 &
    pidof "$STAGEDIR/$NODE" > "$STAGEDIR/meteor.pid"
}
function stop_stage {
    kill `cat $STAGEDIR/meteor.pid`
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
    start_stage)
        start_stage ;;
    stop_stage)
        stop_stage ;;
    restart_stage)
        stop_stage
        start_stage
        ;;
    *)
echo "usage: meteor {start|stop|start_stage|stop_stage}" ;;
esac
exit 0


