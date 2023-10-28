#!/usr/bin/env bash

# Check if an argument is provided
if [ $# -eq 0 ]; then
  echo "Error: No filename provided."
  echo "Usage: ./create-migration.sh <filename>"
  exit 1
fi

# Extract the filename from the command line argument
filename="$1"

# Specify the directory path
directory="src/db/migrations"

# Build the full file path
filePath="$directory/$filename"

# Run the migration command with the appended file name
yarn typeorm migration:create "$filePath"
