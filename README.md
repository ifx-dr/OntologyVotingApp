# OntologyVotingApp
Voting App for ontology update without relying on the blockchain.

## Prerequisites

It is recomended to install Node version v16.15.1 and NPM 8.11.0.

The voting app can be run on Windows Powershell and Linux. It is currently set up for Windows Powershell. If you prefer Linux, you just need to change the start command inside the package.json file to match this one:

    "scripts": {
        "start": "export HTTPS=true && export PORT=3006 && react-scripts start"
    }


## Start the Backend

- Go into the Backend/ folder:

    cd Backend/

- If it is the first time starting the backend, dependencies need to be installed.

    npm i 

- Start the Backend:

    node app.js

## Start the Frontend

- Go into the Frontend/ folder:

    cd Frontend/

- If it is the first time starting the backend, dependencies need to be installed.

    npm i

- Start the frontend:

    npm start

## Author
- Eugénie Laugier
