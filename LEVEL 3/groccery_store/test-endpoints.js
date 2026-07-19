#!/usr/bin/env node

const https = require('https');

const JIRA_DOMAIN = 'mueenakram4.atlassian.net';
const JIRA_EMAIL = 'mueenakram4@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF05zQsH9mlA2YbX7RqXb9byqL9osZJxTQe7DAl2iHUfdv8cLGY8vpEk27I8mjbhrklowvp8RVy5Xo8iRT3WlIZhTYOF-ZIiJdfA0LAPHTS8T6bEaROoLnSKQGnhQFetD-oJZfEzWIYxte_aHOkFLZ9N7iH3b8NOoKfcqEI6XYG9X8=55D1584C';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

    const options = {
      hostname: JIRA_DOMAIN,
      path: path,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        if (body) console.log(`Response: ${body}`);
        resolve();
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testEndpoints() {
  console.log('Testing different Jira API endpoints...\n');

  console.log('1. Testing /rest/api/3/issues/OGS-144:');
  await makeRequest('GET', '/rest/api/3/issues/OGS-144');

  console.log('\n2. Testing /rest/api/2/issue/OGS-144:');
  await makeRequest('GET', '/rest/api/2/issue/OGS-144');
}

testEndpoints().catch(console.error);
