#!/bin/bash

# Install Node.js and npm if not installed
if ! [ -x "$(command -v node)" ] || ! [ -x "$(command -v npm)" ]; then
  echo "Node.js or npm not found. Installing..."
  sudo apt update
  sudo apt install -y nodejs npm
fi

# Install Python 3 if not installed
if ! [ -x "$(command -v python3)" ]; then
  echo "Python 3 not found. Installing..."
  sudo apt update
  sudo apt install -y python3
fi

# Set up Python virtual environment and install requirements
pip3 install virtualenv
virtualenv -p /usr/bin/python3 venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 ./backend/manage.py makemigrations
python3 ./backend/manage.py migrate

# Install frontend dependencies
cd frontend
npm install
npm install react-router-dom
npm install axios
cd ..
