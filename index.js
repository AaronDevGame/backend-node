const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware to check x-api-key header
app.use((req, res, next) => {

  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      code: 403,
      msg: 'Forbidden: Invalid API Key'
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

// 🔁 POST route to toggle API status
app.post('/toggle-api', (req, res) => {
  const { enabled } = req.body;

  if (typeof enabled !== 'boolean') {
    return res.status(400).json({
      code: 400,
      msg: "Missing or invalid 'enabled' boolean in request body"
    });
  }

  apiEnabled = enabled;
  res.json({
    code: 200,
    msg: `API is now ${apiEnabled ? 'enabled' : 'disabled'}`
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});