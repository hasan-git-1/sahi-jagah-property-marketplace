// Vercel serverless function - Professional approach
export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  console.log(`${method} ${url}`);

  try {
    // Health check endpoint
    if (url === '/health' && method === 'GET') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Vercel serverless backend working',
        environment: process.env.NODE_ENV || 'development'
      });
    }

    // API health check
    if (url === '/api/v1/health' && method === 'GET') {
      return res.status(200).json({
        success: true,
        message: 'API endpoints working',
        timestamp: new Date().toISOString(),
        version: 'v1'
      });
    }

    // Signup endpoint
    if (url === '/api/v1/auth/signup' && method === 'POST') {
      const { name, email, password, role } = req.body || {};

      // Validation
      if (!name || !role) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Name and role are required'
          }
        });
      }

      if (!['client', 'owner', 'agent'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid role. Must be client, owner, or agent'
          }
        });
      }

      // Simulate successful signup
      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: 'user_' + Date.now(),
            name: name,
            email: email,
            role: role,
            isVerified: false,
            createdAt: new Date().toISOString()
          },
          accessToken: 'jwt_' + Date.now(),
          refreshToken: 'refresh_' + Date.now()
        },
        message: 'User created successfully'
      });
    }

    // Login endpoint
    if (url === '/api/v1/auth/login' && method === 'POST') {
      const { email, password } = req.body || {};

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Email and password are required'
          }
        });
      }

      // Simulate successful login
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: 'user_login_' + Date.now(),
            name: 'Test User',
            email: email,
            role: 'client',
            isVerified: true,
            lastLoginAt: new Date().toISOString()
          },
          accessToken: 'jwt_login_' + Date.now(),
          refreshToken: 'refresh_login_' + Date.now()
        },
        message: 'Login successful'
      });
    }

    // Handle all other routes
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${method} ${url} not found`,
        availableRoutes: [
          'GET /health',
          'GET /api/v1/health',
          'POST /api/v1/auth/signup',
          'POST /api/v1/auth/login'
        ]
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server',
        timestamp: new Date().toISOString()
      }
    });
  }
}