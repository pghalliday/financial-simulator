#!/usr/bin/env bash

set -e

jupytext --to notebook "$1"
