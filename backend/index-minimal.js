// Ultra-minimal backend for Vercel - NO dependencies
const http = require('http');
const url = require('url');

// Simple CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Parse JSON body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Main handler
async function handler(req, res) {
  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  try {
    // Health check
    if (path === '/health' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Ultra-minimal backend working'
      }));
      return;
    }

    // API Health check
    if (path === '/api/v1/health' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'API is working',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Signup endpoint
    if (path === '/api/v1/auth/signup' && method === 'POST') {
      const body = await parseBody(req);
      const { name, email, password, role } = body;

      if (!name || !role) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Name and role are required'
          }
        }));
        return;
      }

      res.writeHead(201);
      res.end(JSON.stringify({
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
      }));
      return;
    }

    // Login endpoint
    if (path === '/api/v1/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Email and password are required'
          }
        }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: {
          user: {
            id: 'test-user-login',
            name: 'Test User',
            email: email,
            role: 'client',
            isVerified: true
          },
          accessToken: 'test-login-token-' + Date.now(),
          refreshToken: 'test-login-refresh-' + Date.now()
        }
      }));
      return;
    }

    // 404 for all other routes
    res.writeHead(404);
    res.end(JSON.stringify({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${method} ${path} not found`
      }
    }));

  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong'
      }
    }));
  }
}

// For Vercel
module.exports = handler;

// For local testing
if (require.main === module) {
  const server = http.createServer(handler);
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Ultra-minimal backend running on port ${PORT}`);
  });
}