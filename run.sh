#!/bin/bash

# Activate the virtual environment
source venv/bin/activate

# Run the backend server in the background
python3 ./backend/manage.py runserver &

# Run the frontend server in the background
cd frontend
npm start &

# Wait for both background processes to complete
wait
