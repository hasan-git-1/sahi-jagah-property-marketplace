// Signup endpoint - Professional implementation
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
    const { name, email, phone, password, role } = req.body || {};

    // Comprehensive validation
    const errors = [];
    
    if (!name || name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters');
    }
    
    if (!role || !['client', 'owner', 'agent'].includes(role)) {
      errors.push('Role is required and must be client, owner, or agent');
    }
    
    if (!email && !phone) {
      errors.push('Either email or phone number is required');
    }
    
    if (email && phone) {
      errors.push('Provide either email or phone, not both');
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }
    
    if (phone && !/^\+?[\d\s-()]{10,}$/.test(phone)) {
      errors.push('Invalid phone number format');
    }
    
    if (email && (!password || password.length < 8)) {
      errors.push('Password is required for email signup and must be at least 8 characters');
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

    // Simulate user creation (in real app, this would save to database)
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    const user = {
      id: userId,
      name: name.trim(),
      email: email || null,
      phone: phone || null,
      role: role,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
      profileComplete: false
    };

    // Generate mock tokens
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
                       Buffer.from(JSON.stringify({
                         userId: userId,
                         role: role,
                         iat: Math.floor(Date.now() / 1000),
                         exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
                       })).toString('base64') + 
                       '.mock_signature';

    const refreshToken = 'refresh_' + userId + '_' + Date.now();

    // Success response
    return res.status(201).json({
      success: true,
      data: {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken
      },
      message: 'User account created successfully'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create user account',
        timestamp: new Date().toISOString()
      }
    });
  }
}