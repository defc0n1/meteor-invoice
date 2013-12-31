
#!/bin/bash

export METEOR_SETTINGS="$(cat $PWD/../config/settings.json)"
export MONGO_URL="mongodb://localhost:27017/invoice"
export METEOR_MOCHA_TEST_DIRS="tests"
