#!/bin/bash

# run the backend server in the background
python3 ./backend/manage.py runserver &

# run the frontend server in the background
cd frontend
npm start &

# wait for both background processes to complete
wait
