#!/usr/bin/env bash

set -e

papermill --cwd . $1 $1
jupyter nbconvert --to markdown $1
