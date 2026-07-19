#!/usr/bin/env node

/**
 * Retry Script for Failed Requirements
 */

const https = require('https');

const JIRA_DOMAIN = 'mueenakram4.atlassian.net';
const JIRA_EMAIL = 'mueenakram4@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF05zQsH9mlA2YbX7RqXb9byqL9osZJxTQe7DAl2iHUfdv8cLGY8vpEk27I8mjbhrklowvp8RVy5Xo8iRT3WlIZhTYOF-ZIiJdfA0LAPHTS8T6bEaROoLnSKQGnhQFetD-oJZfEzWIYxte_aHOkFLZ9N7iH3b8NOoKfcqEI6XYG9X8=55D1584C';
const PROJECT_KEY = 'OGS';

const failedRequirements = [
  {
    summary: 'API Rate Limiting and DDoS Protection',
    description: 'Implement rate limiting to prevent abuse.',
    issueType: 'Story',
    labels: ['nfr', 'security', 'backend'],
    storyPoints: 4,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'Rate limit by IP',
      'Rate limit by user',
      'Configure limits per endpoint',
      'Return 429 when limit exceeded',
      'DDoS protection headers',
      'Whitelist trusted IPs'
    ]
  },
  {
    summary: 'Mobile Responsiveness and Performance',
    description: 'Ensure app works smoothly on mobile devices.',
    issueType: 'Story',
    labels: ['nfr', 'performance', 'frontend', 'mobile'],
    storyPoints: 5,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'Mobile-first design',
      'Touch-friendly buttons',
      'Image optimization',
      'Lazy loading implementation',
      'Performance < 3s load time',
      'LightHouse score > 80'
    ]
  },
  {
    summary: 'SSL/TLS and HTTPS Encryption',
    description: 'Secure all communications with HTTPS.',
    issueType: 'Story',
    labels: ['nfr', 'security', 'devops'],
    storyPoints: 3,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'SSL certificate installed',
      'Redirect HTTP to HTTPS',
      'HSTS header enabled',
      'No mixed content',
      'Certificate auto-renewal',
      'TLS 1.2+ only'
    ]
  }
];

function makeJiraRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

    const options = {
      hostname: JIRA_DOMAIN,
      path: path,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`Jira API Error (${res.statusCode}): ${JSON.stringify(response)}`));
          } else {
            resolve(response);
          }
        } catch (e) {
          if (res.statusCode >= 400) {
            reject(new Error(`Jira API Error (${res.statusCode}): ${body}`));
          } else {
            resolve(body);
          }
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

async function createIssue(requirement) {
  let descriptionText = requirement.description || requirement.summary;
  if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) {
    descriptionText += '\n\nAcceptance Criteria:\n';
    requirement.acceptanceCriteria.forEach(ac => {
      descriptionText += `• ${ac}\n`;
    });
  }

  const issueData = {
    fields: {
      project: {
        key: PROJECT_KEY
      },
      summary: requirement.summary,
      description: descriptionText,
      issuetype: {
        name: requirement.issueType
      },
      labels: requirement.labels || [],
      customfield_10016: requirement.storyPoints || 0
    }
  };

  const response = await makeJiraRequest('POST', '/rest/api/2/issue', issueData);
  return response;
}

async function retryFailedRequirements() {
  console.log('🔄 Retrying Failed Requirements\n');
  
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < failedRequirements.length; i++) {
    const req = failedRequirements[i];
    process.stdout.write(`[${i + 1}/3] Retrying: ${req.summary}...`);

    try {
      const response = await createIssue(req);
      successCount++;
      console.log(` ✅ Created [${response.key}]\n`);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      failureCount++;
      console.log(` ❌ Failed\n`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RETRY SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Successfully Created: ${successCount}/3`);
  console.log(`❌ Failed: ${failureCount}/3`);
}

retryFailedRequirements().catch(console.error);
