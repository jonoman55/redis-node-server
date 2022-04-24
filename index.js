import express from 'express';
import fetch from 'node-fetch';
import morgan from 'morgan';
import dotenv from 'dotenv';
import redis from 'redis';

// Load .env file
dotenv.config({
    path: './sample.env'
});

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Create Redis client
const client = redis.createClient({
    port: REDIS_PORT
});

// Connect Redis client
(async () => {
    await client.connect();
})();

client.on('connect', () =>
    console.log('::> Redis Client Connected')
);
client.on('error', (err) =>
    console.log('<:: Redis Client Error', err)
);

// Initialize Express
const app = express();

// HTTP logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set Response
function setResponse(username, repos) {
    return `<h2>${username} has ${repos} public GitHub repos</h2>`;
}

// Make request to GitHub API for data
async function getRepos(req, res, next) {
    try {
        console.log('Fetching data...');
        const { username } = req.params;
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        const repos = data?.public_repos;
        // Set data to Redis
        await client.setEx(username, 3600, repos);
        res.send(setResponse(username, repos));
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

// Cache middleware
async function cache(req, res, next) {
    try {
        const { username } = req.params;
        const data = await client.get(username);
        if (data) {
            console.log('Data cached to redis...');
            res.send(setResponse(username, data));
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

// Route w/ caching middleware
app.get('/repos/:username', cache, getRepos);

// Start Express server
app.listen(PORT, () =>
    console.log(`Server is now running on port: ${PORT}`)
);