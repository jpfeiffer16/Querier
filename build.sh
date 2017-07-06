#! /bin/bash

if [ ! -d "build" ]; then
  mkdir build
fi

rm build/* -r

./node_modules/.bin/electron-packager ./ --platform linux --arch x64 --icon images/icon.png --out build/
./node_modules/.bin/electron-packager ./ --platform darwin --arch x64 --icon images/icon.png --out build/

cd build

tar -cvzf querier-linux-x64.tar.gz querier-linux-x64
zip -r querier-linux-x64.zip querier-linux-x64/*
zip -r querier-darwin-x64.zip querier-darwin-x64/*