#!/bin/bash

if [[ $ENV == 'local' ]]; then
  npm run watch
else
  npm run forever-fg
fi
