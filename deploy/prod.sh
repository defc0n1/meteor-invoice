
#!/bin/bash

CDIR=/apps/config

export METEOR_SETTINGS="$(cat $CDIR/invoice.json)"
export NODE_ENV=production
export ROOT_URL=http://invoice.tradehouse.as
export PORT=18203
export MONGO_URL=mongodb://localhost:22282/invoice
