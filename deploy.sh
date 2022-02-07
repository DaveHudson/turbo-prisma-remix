#!/bin/bash

#######################################################################################################
#
# Fly.io deploy
#
echo Deploying Remix Blog to Fly

fly deploy --config ./fly.toml --dockerfile ./Dockerfile
