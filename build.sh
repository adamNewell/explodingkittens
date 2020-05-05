#!/usr/bin/env bash

command="b"

if [ $# -eq 1 ] && [ "$1" != "build" ] && [ "$1" != "b" ]
then
  if [ "$1" == "run" ] || [ "$1" == "r" ]
  then
    command="r"
  elif [ "$1" == "start" ] || [ "$1" == "s" ]
  then
    command="s"
  elif [ "$1" == "kill" ] || [ "$1" == "k" ]
  then
    command="k"
  else
    echo "USAGE:"
    echo "       ./build.sh <build|b|run|r|start|s>"
  fi
fi

if [ $command == "b" ]
then
  echo "docker build -t adamnewell/kittens:latest -f docker/Dockerfile ."
  docker build -t kittens:latest -f docker/Dockerfile .
elif [ $command == "r" ]
then
  echo "docker run -p 8080:3000 -p 8000:8000 -d kittens"
  docker run -p 8080:3000 -p 8000:8000 -d kittens
elif [ $command == "s" ]
then
  echo "node -r esm src/server.js & npm run start"
  node -r esm src/server.js & npm run start
elif [ $command == "k" ]
then
  container_id=$(docker container ls | grep kittens | awk '{print $1}')
  echo "docker kill ${container_id}"
  docker kill "${container_id}"
fi
