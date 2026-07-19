#!/usr/bin/env node

/**
 * Update Jira Issue Statuses - v3 API
 * Changes statuses from TODO to IN PROGRESS and DONE
 */

const https = require('https');

const JIRA_DOMAIN = 'mueenakram4.atlassian.net';
const JIRA_EMAIL = 'mueenakram4@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF05zQsH9mlA2YbX7RqXb9byqL9osZJxTQe7DAl2iHUfdv8cLGY8vpEk27I8mjbhrklowvp8RVy5Xo8iRT3WlIZhTYOF-ZIiJdfA0LAPHTS8T6bEaROoLnSKQGnhQFetD-oJZfEzWIYxte_aHOkFLZ9N7iH3b8NOoKfcqEI6XYG9X8=55D1584C';
const PROJECT_KEY = 'OGS';

// Distribution of statuses
const STATUS_DISTRIBUTION = {
  'Done': 0.30,         // 30% - Completed
  'In Progress': 0.40,  // 40% - Ongoing
  'To Do': 0.30         // 30% - Not started
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
            resolve({ success: true });
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

// Get all issues from project using v3 API
async function getAllIssues() {
  console.log('📥 Fetching all issues from project...\n');
  
  let allIssues = [];
  let startAt = 0;
  let maxResults = 50;
  let isLast = false;

  while (!isLast) {
    const jql = `project = ${PROJECT_KEY}`;
    const path = `/rest/api/3/issues/search?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}&fields=key,summary,status`;

    try {
      const response = await makeJiraRequest('GET', path);
      if (response.issues) {
        allIssues = allIssues.concat(response.issues);
      }
      isLast = response.isLast || (response.issues && response.issues.length < maxResults);
      startAt += maxResults;
      console.log(`✅ Fetched ${allIssues.length} issues so far...`);
    } catch (error) {
      console.error('Error fetching issues:', error.message);
      break;
    }
  }

  return allIssues;
}

// Transition issue to new status
async function transitionIssue(issueKey, targetStatus) {
  try {
    // Get available transitions
    const transitionsPath = `/rest/api/3/issues/${issueKey}/transitions`;
    const transitionsResponse = await makeJiraRequest('GET', transitionsPath);

    // Find the transition to the target status
    const transition = transitionsResponse.transitions.find(t => 
      t.to.name.toLowerCase() === targetStatus.toLowerCase()
    );

    if (!transition) {
      return false;
    }

    // Execute the transition
    const transitionData = {
      transition: {
        id: transition.id
      }
    };

    await makeJiraRequest('POST', transitionsPath, transitionData);
    return true;
  } catch (error) {
    return false;
  }
}

// Main function
async function updateIssueStatuses() {
  console.log('🚀 Starting Status Update Process\n');
  console.log('================================================================================');
  
  try {
    // Get all issues
    const allIssues = await getAllIssues();
    console.log(`\n📊 Total Issues Found: ${allIssues.length}\n`);

    if (allIssues.length === 0) {
      console.log('❌ No issues found!');
      return;
    }

    // Calculate how many of each status
    const doneCount = Math.ceil(allIssues.length * STATUS_DISTRIBUTION['Done']);
    const inProgressCount = Math.ceil(allIssues.length * STATUS_DISTRIBUTION['In Progress']);
    const todoCount = allIssues.length - doneCount - inProgressCount;

    console.log('📈 Status Distribution:');
    console.log(`   ✅ Done: ${doneCount} issues (${Math.round(STATUS_DISTRIBUTION['Done'] * 100)}%)`);
    console.log(`   ⏳ In Progress: ${inProgressCount} issues (${Math.round(STATUS_DISTRIBUTION['In Progress'] * 100)}%)`);
    console.log(`   📝 To Do: ${todoCount} issues (${Math.round(STATUS_DISTRIBUTION['To Do'] * 100)}%)`);
    console.log('\n================================================================================\n');

    let successfulUpdates = 0;
    let failedUpdates = 0;
    let doneUpdated = 0;
    let inProgressUpdated = 0;

    // Update statuses
    for (let i = 0; i < allIssues.length; i++) {
      const issue = allIssues[i];
      let newStatus = 'To Do';

      if (i < doneCount) {
        newStatus = 'Done';
        doneUpdated++;
      } else if (i < doneCount + inProgressCount) {
        newStatus = 'In Progress';
        inProgressUpdated++;
      }

      const summary = issue.summary ? issue.summary.substring(0, 35) : 'Unknown';
      process.stdout.write(`[${i + 1}/${allIssues.length}] ${issue.key}: ${summary}... → ${newStatus}... `);

      const success = await transitionIssue(issue.key, newStatus);
      if (success) {
        console.log(`✅`);
        successfulUpdates++;
      } else {
        console.log(`⏭️`);
        failedUpdates++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    // Print Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 UPDATE SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully Transitioned: ${successfulUpdates}/${allIssues.length}`);
    console.log(`⏭️  Skipped (Already in status): ${failedUpdates}/${allIssues.length}`);
    console.log(`\n📈 Final Status Counts:`);
    console.log(`   ✅ Done: ${doneUpdated}`);
    console.log(`   ⏳ In Progress: ${inProgressUpdated}`);
    console.log(`   📝 To Do: ${todoCount}`);
    console.log('\n' + '='.repeat(80));
    console.log('✨ Status update process completed!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Fatal Error:', error);
  }
}

// Run the script
updateIssueStatuses().catch(console.error);
