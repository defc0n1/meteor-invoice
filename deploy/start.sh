#!/bin/bash

NODE=/usr/local/bin/node
DIR=/apps/invoice
LOG=/apps/log/invoice.log
LOG_STAGING=/apps/log/invoice_staging.log
PID=/apps/pid/invoice.pid
PID_STAGING=/apps/pid/invoice_staging.pid
test -x "$NODE" || exit 0


function start_app {
    source "$DIR/deploy/prod.sh"
    nohup "$NODE" "$DIR/deploy/bundle/main.js" 1>>"$LOG" 2>&1 &
}
function start_staging {
    source "$DIR/deploy/staging.sh"
    nohup "$NODE" "$DIR/deploy/bundle/main.js" 1>>"$LOG_STAGING" 2>&1 &
}
function stop_staging {
    kill `cat $PID_STAGING`
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
    start_staging)
        start_staging ;;
    stop_staging)
        stop_staging ;;
    restart_stage)
        stop_staging
        start_staging
        ;;
    *)
echo "usage: meteor {start|stop|start_staging|stop_staging}" ;;
esac
exit 0


