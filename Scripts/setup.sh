#!/bin/bash
# setup.sh: Installs pre-commit and sets up Git hooks

# Install pip if necessary
if ! command -v pip &> /dev/null
then
    echo "pip not found, installing pip..."
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    python get-pip.py
fi

# Install pre-commit using pip
pip install pre-commit

# Install the pre-commit hooks
pre-commit install

# Success message
echo "Setup complete. Pre-commit hooks are installed and Markdown linting is enabled."
