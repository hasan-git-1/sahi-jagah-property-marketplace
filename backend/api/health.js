// Health check endpoint
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
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Health check passed',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } else {
    res.status(405).json({
      error: 'Method not allowed',
      allowed: ['GET']
    });
  }
}