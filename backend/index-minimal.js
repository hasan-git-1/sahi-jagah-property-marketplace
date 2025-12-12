// Minimal working backend for immediate testing
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins during debugging
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Minimal backend is working'
  });
});

// API health check
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Basic signup endpoint for testing
app.post('/api/v1/auth/signup', (req, res) => {
  console.log('Signup request received:', req.body);
  
  const { name, email, password, role } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Name and role are required'
      }
    });
  }
  
  // Simulate successful signup
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: 'test-user-' + Date.now(),
        name: name,
        email: email,
        role: role,
        isVerified: false
      },
      accessToken: 'test-token-' + Date.now(),
      refreshToken: 'test-refresh-token-' + Date.now()
    }
  });
});

// Catch all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong'
    }
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Minimal backend running on port ${PORT}`);
  });
}

module.exports = app;