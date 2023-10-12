#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

cp ./hooks/pre-push $PROJECT_ROOT/.git/hooks/
