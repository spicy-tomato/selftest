#!/bin/bash

# Check if at least one argument is passed
if [ $# -lt 1 ]; then
  echo "Error: At least one environment variable name is required."
  exit 1
fi

# Generate the .env file
echo "Generating .env file..."
> .env  # Clear or create the file

for var_name in "$@"; do
  # Get the value of the variable from the current environment
  var_value=${!var_name}

  # Append to the .env file
  echo "${var_name}=${var_value}" >> .env
done

echo ".env file generated successfully!"
