#!/usr/bin/env bash

set -e

find . -name README.ipynb -exec ./jupytext_notebook_to_py.sh {} \;
