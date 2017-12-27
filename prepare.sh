#! /bin/bash
cd $(dirname $(readlink -f ${BASH_SOURCE[0]}))

git reset HEAD --hard
git pull

chmod +x ./run.sh
chmod +x ./run_sharding.sh
chmod +x ./prepare.sh

npm install