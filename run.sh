#! /bin/bash
git reset HEAD --hard
git pull

chmod +x ./run.sh
chmod +x ./run_sharding.sh

npm install

dir="$(basename $PWD)"

pm2 stop $dir
pm2 start index.js --name $dir
pm2 info $dir