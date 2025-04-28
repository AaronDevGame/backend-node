const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// Path to toggle state file
const toggleFilePath = path.join(__dirname, 'toggle.json');

// Helper to read toggle state
const isApiEnabled = () => {
  try {
    const data = fs.readFileSync(toggleFilePath);
    const json = JSON.parse(data);
    return json.enabled;
  } catch (err) {
    return true; // Default to true if file read fails
  }
};

// Middleware: API key check
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ code: 403, msg: 'Forbidden: Invalid API Key' });
  }
  next();
});

// Middleware: API enabled check
app.use((req, res, next) => {
  if (req.path === '/toggle-api') return next(); // skip toggle check for toggle-api endpoint

  if (!isApiEnabled()) {
    return res.status(503).json({ code: 503, msg: 'Service temporarily disabled' });
  }

  next();
});

// // GET status
// app.get('/status', (req, res) => {
//   res.json({ code: 200, msg: "success" });
// });

// GET status
let lastActive = Date.now();
app.get('/status', (req, res) => {
  try {
    // Calculate the time since last access
    const timeSinceLastActive = Date.now() - lastActive;
    const seconds = Math.floor(timeSinceLastActive / 1000);

    // Update lastActive after responding
    lastActive = Date.now();
    
    res.json({
      code: 200,
      msg: "success",
      timeSinceLastActive: `${seconds} seconds ago` // Respond with how long since the last activity
    });
  } catch (error) {
    console.error('Error in /status endpoint:', error);
    res.status(500).json({ code: 500, msg: 'Internal Server Error' });
  }
});

// POST hello
app.post('/hello', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ code: 400, msg: "Missing 'name' in request body" });

  res.json({ code: 200, msg: `Hello, ${name}` });
});

// POST toggle
app.post('/toggle-api', (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ code: 400, msg: "Missing or invalid 'enabled' boolean in request body" });
  }

  fs.writeFileSync(toggleFilePath, JSON.stringify({ enabled }, null, 2));
  res.json({ code: 200, msg: `API is now ${enabled ? 'enabled' : 'disabled'}` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
