// API v1 health check
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'API v1 is working',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: [
        'GET /api/v1/health',
        'POST /api/v1/auth/signup',
        'POST /api/v1/auth/login'
      ]
    });
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}