const express = require('express');
const bodyParser = require('body-parser');

const { mongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';

const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const client = new mongoClient(uri);
})