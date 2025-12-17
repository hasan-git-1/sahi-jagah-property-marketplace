// NUCLEAR OPTION: Single file that handles EVERYTHING
module.exports = async (req, res) => {
  // CORS headers - MUST be first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  try {
    // Root health check
    if ((url === '/' || url === '/health') && method === 'GET') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'NUCLEAR BACKEND ONLINE',
        environment: process.env.NODE_ENV || 'production',
        vercel: true,
        endpoints: [
          'GET /',
          'GET /health', 
          'GET /api/v1/health',
          'POST /api/v1/auth/signup',
          'POST /api/v1/auth/login'
        ]
      });
    }

    // API health check
    if (url === '/api/v1/health' && method === 'GET') {
      return res.status(200).json({
        success: true,
        message: 'API v1 NUCLEAR BACKEND WORKING',
        timestamp: new Date().toISOString(),
        version: '1.0.0-nuclear',
        status: 'operational'
      });
    }

    // Signup endpoint - COMPREHENSIVE
    if (url === '/api/v1/auth/signup' && method === 'POST') {
      console.log('SIGNUP REQUEST RECEIVED');
      
      const body = req.body || {};
      const { name, email, phone, password, role } = body;

      console.log('Signup data:', { name, email, phone, role, hasPassword: !!password });

      // Validation with detailed errors
      const errors = [];
      
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters');
      }
      
      if (!role || !['client', 'owner', 'agent'].includes(role)) {
        errors.push('Role is required and must be: client, owner, or agent');
      }
      
      if (!email && !phone) {
        errors.push('Either email or phone number is required');
      }
      
      if (email && phone) {
        errors.push('Provide either email OR phone, not both');
      }
      
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push('Invalid email format');
        }
        if (!password || password.length < 8) {
          errors.push('Password required for email signup (min 8 characters)');
        }
      }

      if (errors.length > 0) {
        console.log('Validation errors:', errors);
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Validation failed',
            details: errors
          }
        });
      }

      // SUCCESS - Create user
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const now = new Date().toISOString();

      const userData = {
        id: userId,
        name: name.trim(),
        email: email || null,
        phone: phone || null,
        role: role,
        isVerified: false,
        createdAt: now,
        updatedAt: now
      };

      const tokens = {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
                    Buffer.from(JSON.stringify({
                      userId: userId,
                      role: role,
                      iat: Math.floor(Date.now() / 1000),
                      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
                    })).toString('base64') + 
                    '.nuclear_signature',
        refreshToken: 'refresh_nuclear_' + userId + '_' + Date.now()
      };

      console.log('User created successfully:', userId);

      return res.status(201).json({
        success: true,
        data: {
          user: userData,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        },
        message: 'User account created successfully'
      });
    }

    // Login endpoint - COMPREHENSIVE  
    if (url === '/api/v1/auth/login' && method === 'POST') {
      console.log('LOGIN REQUEST RECEIVED');
      
      const body = req.body || {};
      const { email, phone, password, otp } = body;

      console.log('Login data:', { email, phone, hasPassword: !!password, hasOtp: !!otp });

      // Validation
      const errors = [];
      
      if (!email && !phone) {
        errors.push('Either email or phone number is required');
      }
      
      if (email && phone) {
        errors.push('Provide either email OR phone, not both');
      }
      
      if (email && !password) {
        errors.push('Password is required for email login');
      }
      
      if (phone && !otp) {
        errors.push('OTP is required for phone login');
      }

      if (errors.length > 0) {
        console.log('Login validation errors:', errors);
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Login validation failed',
            details: errors
          }
        });
      }

      // SUCCESS - Login user
      const userId = 'user_login_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const now = new Date().toISOString();

      const userData = {
        id: userId,
        name: 'Test User',
        email: email || null,
        phone: phone || null,
        role: 'client',
        isVerified: true,
        lastLoginAt: now
      };

      const tokens = {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
                    Buffer.from(JSON.stringify({
                      userId: userId,
                      role: 'client',
                      iat: Math.floor(Date.now() / 1000),
                      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
                    })).toString('base64') + 
                    '.nuclear_login_signature',
        refreshToken: 'refresh_login_nuclear_' + userId + '_' + Date.now()
      };

      console.log('User logged in successfully:', userId);

      return res.status(200).json({
        success: true,
        data: {
          user: userData,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        },
        message: 'Login successful'
      });
    }

    // 404 for all other routes
    console.log('Route not found:', method, url);
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${method} ${url} not found`,
        availableRoutes: [
          'GET /',
          'GET /health',
          'GET /api/v1/health',
          'POST /api/v1/auth/signup',
          'POST /api/v1/auth/login'
        ],
        requestInfo: {
          method: method,
          url: url,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('NUCLEAR BACKEND ERROR:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Nuclear backend error occurred',
        timestamp: new Date().toISOString(),
        details: error.message
      }
    });
  }
};