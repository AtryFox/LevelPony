#! /bin/bash
sh ./prepare.sh

dir="$(basename $PWD)-sharding"

pm2 stop $dir
pm2 start index_sharding.js --name $dir
pm2 info $dir