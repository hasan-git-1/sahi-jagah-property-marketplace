// Quick API test script
const https = require('https');

function testAPI(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🔍 Testing Sahi Jagah Backend API...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const health = await testAPI('https://sahijagahproperty.vercel.app/api/v1/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
  }

  console.log('\n');

  // Test 2: Signup endpoint
  try {
    console.log('2. Testing signup endpoint...');
    const signup = await testAPI('https://sahijagahproperty.vercel.app/api/v1/auth/signup', 'POST', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      role: 'client'
    });
    console.log(`   Status: ${signup.status}`);
    console.log(`   Response:`, signup.data);
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
  }

  console.log('\n');

  // Test 3: Basic root endpoint
  try {
    console.log('3. Testing root endpoint...');
    const root = await testAPI('https://sahijagahproperty.vercel.app/');
    console.log(`   Status: ${root.status}`);
    console.log(`   Response:`, root.data);
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
  }
}

runTests().catch(console.error);