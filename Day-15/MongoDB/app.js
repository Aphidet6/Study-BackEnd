const express = require('express');
const bodyParser = require('body-parser');

const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';

const app = express();
app.use(bodyParser.json());


app.post('/register', async (req, res) => {
    const client = new MongoClient(uri);

    try{
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('users');
        const result = await collection.insertOne(req.body);
        res.send(result);
    } finally {
        await client.close();
    }
})
app.post('/login', async (req, res) => {
    try{
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('users');
        const result = collection.findOne(req.body);
        res.send(result);
    } finally {
        await client.close();
    }
})

app.listen(3000, () => {
    console.log('http://localhost:3000');
});