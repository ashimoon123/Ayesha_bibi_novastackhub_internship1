#!/usr/bin/env node

const https = require('https');

const JIRA_DOMAIN = 'mueenakram4.atlassian.net';
const JIRA_EMAIL = 'mueenakram4@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF05zQsH9mlA2YbX7RqXb9byqL9osZJxTQe7DAl2iHUfdv8cLGY8vpEk27I8mjbhrklowvp8RVy5Xo8iRT3WlIZhTYOF-ZIiJdfA0LAPHTS8T6bEaROoLnSKQGnhQFetD-oJZfEzWIYxte_aHOkFLZ9N7iH3b8NOoKfcqEI6XYG9X8=55D1584C';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

    const options = {
      hostname: JIRA_DOMAIN,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data.substring(0, 200)}`);
        resolve();
      });
    }).on('error', reject).end();
  });
}

async function testConnections() {
  console.log('Testing Jira API connections...\n');

  console.log('1. Testing /rest/api/3/myself:');
  await makeRequest('/rest/api/3/myself').catch(e => console.log(`Error: ${e.message}`));

  console.log('\n2. Testing /rest/api/2/myself:');
  await makeRequest('/rest/api/2/myself').catch(e => console.log(`Error: ${e.message}`));

  console.log('\n3. Testing /rest/api/3/projects/OGS:');
  await makeRequest('/rest/api/3/projects/OGS').catch(e => console.log(`Error: ${e.message}`));

  console.log('\n4. Testing /rest/api/2/project/OGS:');
  await makeRequest('/rest/api/2/project/OGS').catch(e => console.log(`Error: ${e.message}`));
}

testConnections().catch(console.error);
