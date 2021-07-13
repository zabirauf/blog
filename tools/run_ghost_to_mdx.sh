#!/bin/bash

deno run --allow-write --allow-net ghost_to_mdx.ts "$1" "$2" ../website/data/blog