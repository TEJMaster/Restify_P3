#!/bin/bash

# Find and terminate the backend server process (Python)
backend_pid=$(ps aux | grep '[p]ython3.*backend/manage.py runserver' | awk '{print $2}')
if [ ! -z "$backend_pid" ]; then
  echo "Terminating backend server with PID $backend_pid"
  kill -9 $backend_pid
else
  echo "Backend server not found"
fi

# Find and terminate the frontend server process (npm)
frontend_pid=$(ps aux | grep '[n]ode.*frontend' | awk '{print $2}')
if [ ! -z "$frontend_pid" ]; then
  echo "Terminating frontend server with PID $frontend_pid"
  kill -9 $frontend_pid
else
  echo "Frontend server not found"
fi
