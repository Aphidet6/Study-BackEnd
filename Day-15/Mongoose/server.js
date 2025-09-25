const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

const redisClient = redis.createClient();

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        process.exit(1);
    }
};

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/users', async (req, res) => {
    try {
        const { id, name, email, age } = req.body;

        // Save user data to Redis
        const user = { id, name, email, age };
        await redisClient.hSet("users", id, JSON.stringify(user));

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await redisClient.hGetAll("users");

        // Convert Redis hash to an array of users
        const userList = Object.values(users).map(user => JSON.parse(user));
        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;

        const existingUser = await redisClient.hGet("users", id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user data in Redis
        const updatedUser = { id, name, email, age };
        await redisClient.hSet("users", id, JSON.stringify(updatedUser));

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: "Error updating user", error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await redisClient.hGet("users", id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user from Redis
        await redisClient.hDel("users", id);

        res.status(200).json({ message: "User deleted successfully", user: JSON.parse(deletedUser) });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

app.listen(port, async () => {
    await connectRedis();
    console.log(`Server is running on http://localhost:${port}`);
});
