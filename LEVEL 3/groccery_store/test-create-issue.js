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
        if (res.statusCode >= 400) {
          reject(new Error(`API Error ${res.statusCode}: ${body}`));
        } else {
          resolve(JSON.parse(body || '{}'));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testCreateIssue() {
  console.log('Testing issue creation with v2 API...\n');

  const issueData = {
    fields: {
      project: {
        key: 'OGS'
      },
      summary: 'Test Issue: User Registration',
      description: 'Test story for user registration functionality\n\nAcceptance Criteria:\n• User can register\n• Email validation works',
      issuetype: {
        name: 'Story'
      },
      labels: ['test', 'auth']
    }
  };

  try {
    const response = await makeRequest('POST', '/rest/api/2/issue', issueData);
    console.log(`\n✅ Issue created successfully!`);
    console.log(`Issue Key: ${response.key}`);
    console.log(`Issue ID: ${response.id}`);
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
  }
}

testCreateIssue();
