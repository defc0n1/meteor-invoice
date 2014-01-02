CDIR=/apps/config

export METEOR_SETTINGS="$(cat $CDIR/invoice_staging.json)"
export NODE_ENV=production
export ROOT_URL=http://invoice.tradehouse.as
export PORT=18204
export MONGO_URL=mongodb://localhost:27017/invoice_staging
