# Node/Express and Redis Client

Fetches and caches GitHub users public repo count.<br /><br />
Subsequent requests to /repos/:username will be faster on each fetch.

## Installation

Run the command below to install the necessary packages.

### `npm install`

## Available Scripts

In the project, you can run:

### `npm run dev`

Runs the app in development mode with nodemon.<br />

The server will reload if you make edits.<br />

### `npm start`

Runs the app without nodemon.

## Server Info

Express server listens on [http://localhost:5000](http://localhost:5000)<br />
Redis connects on [127.0.0.1:6379](127.0.0.1:6379])

## Route Info

GET /repos/:username<br />
[http://localhost:5000/repos/jonoman55](http://localhost:5000/repos/jonoman55)
