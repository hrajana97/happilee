const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Happilee API!' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API server running on port ${port}`);
}); 