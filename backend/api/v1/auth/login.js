// Login endpoint - Professional implementation
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed'
      }
    });
  }

  try {
    const { email, phone, password, otp } = req.body || {};

    // Validation
    const errors = [];
    
    if (!email && !phone) {
      errors.push('Either email or phone number is required');
    }
    
    if (email && phone) {
      errors.push('Provide either email or phone, not both');
    }
    
    if (email && !password) {
      errors.push('Password is required for email login');
    }
    
    if (phone && !otp) {
      errors.push('OTP is required for phone login');
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Validation failed',
          details: errors
        }
      });
    }

    // Simulate authentication (in real app, this would check database)
    const userId = 'user_login_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    // Mock user data
    const user = {
      id: userId,
      name: 'Test User',
      email: email || null,
      phone: phone || null,
      role: 'client',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: now,
      lastLoginAt: now,
      profileComplete: true
    };

    // Generate mock tokens
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
                       Buffer.from(JSON.stringify({
                         userId: userId,
                         role: 'client',
                         iat: Math.floor(Date.now() / 1000),
                         exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
                       })).toString('base64') + 
                       '.mock_signature';

    const refreshToken = 'refresh_login_' + userId + '_' + Date.now();

    // Success response
    return res.status(200).json({
      success: true,
      data: {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Login failed',
        timestamp: new Date().toISOString()
      }
    });
  }
}