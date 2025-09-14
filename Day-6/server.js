const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: "Hello, World!"
  });
});

app.post('/', (req, res) => {
  res.send("POST request received V3");
});
app.get('/api', (req, res) => {
  res.send({
    message: "Hello, World!"
  });
});
app.get('/submit', (req, res) => {
  res.send({
    message: "Api Path /submit"
  });
});
//ดึงข้อมูลจาก path parameter
app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Update data ID : ${id}`);
});
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Delete data ID : ${id}`);
});
//ดึงข้อมูลจาก query string
app.get('/info', (req, res) => {
  const name = req.query.name || 'Guest';
  const age = req.query.age || 'Unknown';
  res.send(`Hello, ${name}. You are ${age} years old.`);
});
//รับข้อมูลจาก body
app.post('/data', (req, res) => {
  const data = req.body;
  res.json({ message: "Data received", data });
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
