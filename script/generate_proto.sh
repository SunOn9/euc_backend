#!/usr/bin/bash
rm -rf src/generated/*
pwd=$(pwd)

cd proto/

PLUGIN_PATH="$pwd/node_modules/.bin/protoc-gen-ts_proto"

OPTION="--ts_proto_opt=useOptionals=none,\
snakeToCamel=true,\
stringEnums=true,\
addNestjsRestParameter=true,\
usePrototypeForDefaults=true,\
useSnakeTypeName=true,\
outputServices=grpc-js"

PROTO_OUT="--ts_proto_out=$pwd/src/generated/"
protoc --plugin=$PLUGIN_PATH "$OPTION" "$PROTO_OUT" ./api.proto

cd ../src/generated/google/protobuf
sed -i 's/import Long = require("long");/import { Long } from "long";/' timestamp.ts