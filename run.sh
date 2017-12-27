#! /bin/bash
sh ./prepare.sh

dir="$(basename $PWD)"

pm2 stop $dir
pm2 start index.js --name $dir
pm2 info $dir