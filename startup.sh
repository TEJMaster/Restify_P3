#!/bin/bash

# Install Homebrew if not installed
if ! [ -x "$(command -v brew)" ]; then
  echo "Homebrew not found. Installing..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Node.js and npm if not installed
if ! [ -x "$(command -v node)" ] || ! [ -x "$(command -v npm)" ]; then
  echo "Node.js or npm not found. Installing..."
  brew update
  brew install node
fi

# Install Python 3 if not installed
if ! [ -x "$(command -v python3)" ]; then
  echo "Python 3 not found. Installing..."
  brew update
  brew install python
fi

# Set up Python virtual environment and install requirements
pip3 install virtualenv
virtualenv -p "$(which python3)" venv

# macOS-specific virtual environment activation command
source venv/bin/activate
# Install requirements
pip3 install -r requirements.txt
python3 ./backend/manage.py makemigrations
python3 ./backend/manage.py migrate

# Install frontend dependencies
cd frontend
npm install
npm install react-router-dom
npm install axios
cd ..
