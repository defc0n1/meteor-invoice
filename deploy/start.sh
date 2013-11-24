#!/bin/bash

NODE=/usr/local/bin/node
DIR=/apps/invoice
LOG=/apps/log/invoice.log
PID=/apps/pid/invoice.pid
STAGEDIR=/apps/invoice_staging
test -x "$DIR/$NODE" || exit 0


function start_app {
    source "$DIR/prod.sh"
    nohup "$DIR/$NODE" "$DIR/bundle/main.js" 1>>"$LOG" 2>&1 &
    pidof "$DIR/$NODE" > "$PID"
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
    kill `cat $PID`
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


