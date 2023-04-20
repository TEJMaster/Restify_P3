# Restify P3 Implementation

We have implemented a React frontend for Restify and connected it to the backend server. The result is a fully-functional, shippable, and visually appealing website that offers a smooth user experience and is easy to understand.

## Scripts

- **startup.sh**: This script sets up everything required for the code to run in a new environment, including both the frontend and backend servers.
- **run.sh**: This script initiates the frontend and backend servers.
- **terminate.sh**: This script terminates the frontend and backend servers.
- **cleanup.sh**: This script clears the database and all migration files.

## Files

- **requirements.txt**: Lists all the necessary packages to run the backend server.
- **package-lock.json**: Ensures that the exact same versions of all installed packages and their dependencies are used when you or someone else installs the project.

## Folders

- **backend**: This folder contains the code for the Django backend server.
- **frontend**: This folder contains the code for the React frontend server.

## Project Setup

To set up the project on a new machine, follow these steps:

1. Run `startup.sh` to create a new virtual environment for the project and install all required packages.
2. Run `run.sh` to start both the frontend and backend servers.
