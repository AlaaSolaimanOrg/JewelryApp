// Local DYMO Proxy Server
// This Node.js server runs on the user's machine and bypasses CORS
// Install: npm install express cors node-fetch@2
// Run: node dymo-proxy-server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 8765; // Custom port for proxy

// DYMO service ports
const DYMO_PORTS = [41951, 41952];

// Enable CORS for all origins (or specify your domain)
app.use(cors({
  origin: '*', // In production, replace with your actual domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.text({ type: 'application/xml' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DYMO Proxy is running' });
});

// Find active DYMO port
async function findDymoPort() {
  for (const port of DYMO_PORTS) {
    try {
      const response = await fetch(`http://localhost:${port}/DYMO/DLS/Printing/StatusConnected`, {
        method: 'GET',
        timeout: 1000
      });
      if (response.ok) {
        return port;
      }
    } catch (err) {
      continue;
    }
  }
  throw new Error('DYMO service not found on any port');
}

// Proxy all DYMO requests
app.all('/dymo/*', async (req, res) => {
  try {
    const dymoPort = await findDymoPort();
    const dymoPath = req.path.replace('/dymo', '');
    const dymoUrl = `http://localhost:${dymoPort}${dymoPath}`;

    console.log(`Proxying ${req.method} request to: ${dymoUrl}`);

    const options = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json'
      }
    };

    if (req.method !== 'GET' && req.body) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(dymoUrl, options);
    const contentType = response.headers.get('content-type');
    
    res.status(response.status);
    res.set('Content-Type', contentType);

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const text = await response.text();
      res.send(text);
    }

  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'DYMO service unavailable',
      message: error.message,
      hint: 'Make sure DYMO Connect is installed and running'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         DYMO Proxy Server Running                      ║
║                                                        ║
║  Port: ${PORT}                                          ║
║  Proxy URL: http://localhost:${PORT}/dymo              ║
║                                                        ║
║  Make sure DYMO Connect is running!                   ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('SIGINT', () => {
  console.log('\nShutting down DYMO Proxy Server...');
  process.exit(0);
});