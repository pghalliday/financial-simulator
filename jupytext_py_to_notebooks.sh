#!/usr/bin/env bash

set -e

find . -name README.py -exec ./jupytext_py_to_notebook.sh {} \;
