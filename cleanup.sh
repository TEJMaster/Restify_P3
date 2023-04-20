#!/bin/bash

# Remove all files in the avatar folder
rm -rf ./avatars/*

# Remove __pycache__ directories
find ./backend -type d -name "__pycache__" -exec rm -r "{}" +

# Remove all migration files except __init__.py
find ./backend -path "*/migrations/*.py" -not -name "__init__.py" -delete
find ./backend -path "*/migrations/*.pyc" -delete

# Remove the database file (assuming SQLite)
rm -f ./backend/db.sqlite3
