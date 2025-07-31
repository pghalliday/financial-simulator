#!/usr/bin/env bash

set -e

find . -name README.ipynb -exec ./convert_readme_notebook.sh {} \;
