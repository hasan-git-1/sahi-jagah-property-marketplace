const https = require('https');

async function testBackend() {
    console.log('🔍 Testing backend status...\n');
    
    const tests = [
        { name: 'Health Check', url: 'https://sahijagahproperty.vercel.app/health' },
        { name: 'API Health', url: 'https://sahijagahproperty.vercel.app/api/v1/health' },
    ];
    
    for (const test of tests) {
        try {
            console.log(`Testing ${test.name}...`);
            const result = await makeRequest(test.url);
            console.log(`✅ ${test.name}: SUCCESS`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Response: ${JSON.stringify(result.data)}\n`);
        } catch (error) {
            console.log(`❌ ${test.name}: FAILED`);
            console.log(`   Error: ${error.message}\n`);
        }
    }
    
    // Test signup
    try {
        console.log('Testing Signup...');
        const signupResult = await makeRequest('https://sahijagahproperty.vercel.app/api/v1/auth/signup', {
            method: 'POST',
            data: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'testpass123',
                role: 'client'
            }
        });
        console.log('✅ Signup: SUCCESS');
        console.log(`   Status: ${signupResult.status}`);
        console.log(`   Response: ${JSON.stringify(signupResult.data)}\n`);
    } catch (error) {
        console.log('❌ Signup: FAILED');
        console.log(`   Error: ${error.message}\n`);
    }
}

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Node.js Test Client'
            }
        };

        const req = https.request(requestOptions, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve({ status: res.statusCode, data });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(new Error(`Network error: ${err.message}`));
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout (10s)'));
        });

        if (options.data) {
            req.write(JSON.stringify(options.data));
        }
        req.end();
    });
}

testBackend().catch(console.error);