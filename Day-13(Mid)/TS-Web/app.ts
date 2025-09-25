import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello! This is a TypeScript Express server.');
});

app.get('/api', (req: Request, res: Response) => {
    res.json({ message: 'This is sample API.' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
