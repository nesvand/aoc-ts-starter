#!/usr/bin/env bash
set -xe

DAY=$1
if [ -z "$DAY" ]; then
    jest --
else
    jest "./test/${DAY}.test.ts"
fi
