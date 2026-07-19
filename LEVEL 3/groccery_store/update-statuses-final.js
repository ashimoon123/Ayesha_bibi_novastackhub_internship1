#!/usr/bin/env node

/**
 * Update Jira Issue Statuses - v2 API (Working)
 */

const https = require('https');

const JIRA_DOMAIN = 'mueenakram4.atlassian.net';
const JIRA_EMAIL = 'mueenakram4@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF05zQsH9mlA2YbX7RqXb9byqL9osZJxTQe7DAl2iHUfdv8cLGY8vpEk27I8mjbhrklowvp8RVy5Xo8iRT3WlIZhTYOF-ZIiJdfA0LAPHTS8T6bEaROoLnSKQGnhQFetD-oJZfEzWIYxte_aHOkFLZ9N7iH3b8NOoKfcqEI6XYG9X8=55D1584C';
const PROJECT_KEY = 'OGS';

// The successful issue keys we created
const issueKeysCreated = [
  'OGS-13', 'OGS-14', 'OGS-15', 'OGS-16', 'OGS-17', 'OGS-18', 'OGS-19',
  'OGS-20', 'OGS-21', 'OGS-22', 'OGS-23', 'OGS-24', 'OGS-25', 'OGS-26',
  'OGS-27', 'OGS-28', 'OGS-29', 'OGS-30', 'OGS-31', 'OGS-32', 'OGS-33',
  'OGS-34', 'OGS-35', 'OGS-36', 'OGS-37', 'OGS-38', 'OGS-39', 'OGS-40',
  'OGS-41', 'OGS-42', 'OGS-43', 'OGS-44', 'OGS-45', 'OGS-46', 'OGS-47',
  'OGS-48', 'OGS-49', 'OGS-50', 'OGS-51', 'OGS-52', 'OGS-53', 'OGS-54',
  'OGS-55', 'OGS-56', 'OGS-57', 'OGS-58', 'OGS-59', 'OGS-60', 'OGS-61',
  'OGS-62', 'OGS-63', 'OGS-64', 'OGS-65', 'OGS-66', 'OGS-67', 'OGS-68',
  'OGS-69', 'OGS-70', 'OGS-71', 'OGS-72', 'OGS-73', 'OGS-74', 'OGS-75',
  'OGS-76', 'OGS-77', 'OGS-78', 'OGS-79', 'OGS-80', 'OGS-81', 'OGS-82',
  'OGS-83', 'OGS-84', 'OGS-85', 'OGS-86', 'OGS-87', 'OGS-88', 'OGS-89',
  'OGS-90', 'OGS-91', 'OGS-92', 'OGS-93', 'OGS-94', 'OGS-95', 'OGS-96',
  'OGS-97', 'OGS-98', 'OGS-99', 'OGS-100', 'OGS-101', 'OGS-102', 'OGS-103',
  'OGS-104', 'OGS-105', 'OGS-106', 'OGS-107', 'OGS-108', 'OGS-109', 'OGS-110',
  'OGS-111', 'OGS-112', 'OGS-113', 'OGS-114', 'OGS-115', 'OGS-116', 'OGS-117',
  'OGS-118', 'OGS-119', 'OGS-120', 'OGS-121', 'OGS-122', 'OGS-123', 'OGS-124',
  'OGS-125', 'OGS-126', 'OGS-127', 'OGS-128', 'OGS-129', 'OGS-130', 'OGS-131',
  'OGS-132', 'OGS-133', 'OGS-134', 'OGS-135', 'OGS-136', 'OGS-137', 'OGS-138',
  'OGS-139', 'OGS-140', 'OGS-141', 'OGS-142', 'OGS-143', 'OGS-144', 'OGS-146',
  'OGS-148', 'OGS-150', 'OGS-152', 'OGS-154', 'OGS-155', 'OGS-156', 'OGS-158',
  'OGS-160', 'OGS-162', 'OGS-164', 'OGS-166', 'OGS-168', 'OGS-170', 'OGS-172',
  'OGS-175', 'OGS-177', 'OGS-179', 'OGS-181', 'OGS-183', 'OGS-184', 'OGS-187',
  'OGS-189', 'OGS-191', 'OGS-193', 'OGS-195', 'OGS-197', 'OGS-199', 'OGS-201',
  'OGS-203', 'OGS-205', 'OGS-207', 'OGS-209', 'OGS-211', 'OGS-212', 'OGS-214',
  'OGS-216', 'OGS-218', 'OGS-220', 'OGS-223', 'OGS-224', 'OGS-226', 'OGS-229',
  'OGS-230', 'OGS-232', 'OGS-234', 'OGS-236', 'OGS-238', 'OGS-240', 'OGS-242',
  'OGS-244', 'OGS-246', 'OGS-248', 'OGS-250', 'OGS-252', 'OGS-255', 'OGS-257',
  'OGS-259', 'OGS-261', 'OGS-263', 'OGS-265', 'OGS-267', 'OGS-269', 'OGS-271'
];

// Distribution
const STATUS_DISTRIBUTION = {
  'Done': 0.30,
  'In Progress': 0.40,
  'To Do': 0.30
};

function makeJiraRequest(method, path, data = null) {
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

    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`Error (${res.statusCode}): ${JSON.stringify(response)}`));
          } else {
            resolve(response);
          }
        } catch (e) {
          if (res.statusCode >= 400) {
            reject(new Error(`Error (${res.statusCode}): ${body}`));
          } else {
            resolve({ success: true });
          }
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Transition issue
async function transitionIssue(issueKey, targetStatus) {
  try {
    const transitionsPath = `/rest/api/2/issue/${issueKey}/transitions`;
    const transitionsResponse = await makeJiraRequest('GET', transitionsPath);

    const transition = transitionsResponse.transitions.find(t => 
      t.to.name.toLowerCase() === targetStatus.toLowerCase()
    );

    if (!transition) return false;

    const transitionData = { transition: { id: transition.id } };
    await makeJiraRequest('POST', transitionsPath, transitionData);
    return true;
  } catch (error) {
    return false;
  }
}

// Main function
async function updateStatuses() {
  console.log('🚀 Starting Status Update\n');
  console.log('================================================================================');
  
  const issues = issueKeysCreated;
  console.log(`\n📊 Total Issues to Update: ${issues.length}\n`);

  const doneCount = Math.ceil(issues.length * STATUS_DISTRIBUTION['Done']);
  const inProgressCount = Math.ceil(issues.length * STATUS_DISTRIBUTION['In Progress']);
  const todoCount = issues.length - doneCount - inProgressCount;

  console.log('📈 Target Distribution:');
  console.log(`   ✅ Done: ${doneCount} (30%)`);
  console.log(`   ⏳ In Progress: ${inProgressCount} (40%)`);
  console.log(`   📝 To Do: ${todoCount} (30%)\n`);
  console.log('================================================================================\n');

  let successCount = 0;
  let doneUpdated = 0;
  let inProgressUpdated = 0;

  for (let i = 0; i < issues.length; i++) {
    const issueKey = issues[i];
    let newStatus = 'To Do';

    if (i < doneCount) {
      newStatus = 'Done';
      doneUpdated++;
    } else if (i < doneCount + inProgressCount) {
      newStatus = 'In Progress';
      inProgressUpdated++;
    }

    process.stdout.write(`[${i + 1}/${issues.length}] ${issueKey}... → ${newStatus.padEnd(12)}... `);

    const success = await transitionIssue(issueKey, newStatus);
    if (success) {
      console.log(`✅`);
      successCount++;
    } else {
      console.log(`⏭️`);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Successfully Updated: ${successCount}/${issues.length}`);
  console.log(`\n📈 Status Breakdown:`);
  console.log(`   ✅ Done: ${doneUpdated}`);
  console.log(`   ⏳ In Progress: ${inProgressUpdated}`);
  console.log(`   📝 To Do: ${todoCount}`);
  console.log(`\n${'='.repeat(80)}`);
  console.log('✨ Update complete!');
  console.log('='.repeat(80));
}

updateStatuses().catch(console.error);
