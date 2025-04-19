const express = require('express');
const API_KEY = '123456';
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware to check x-api-key header
app.use((req, res, next) => {
  const key = req.header('x-api-key');
  if (key !== API_KEY) {
    return res.status(401).json({
      code: 401,
      msg: 'Unauthorized – invalid or missing API key'
    });
  }
  next();
});

// GET route
app.get('/status', (req, res) => {
  res.json({
    code: 200,
    msg: "success"
  });
});

// POST route
app.post('/hello', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      code: 400,
      msg: "Missing 'name' in request body"
    });
  }

  res.json({
    code: 200,
    msg: `Hello, ${name}`
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});