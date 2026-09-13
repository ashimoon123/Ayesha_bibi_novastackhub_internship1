const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[36m%s\x1b[0m', '  Jawad Naseeb Trading & Crypto Platform Runner   ');
console.log('\x1b[36m%s\x1b[0m', '  Backend API + Frontend Client + Middleware       ');
console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Start backend server
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

server.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[35m[BACKEND]\x1b[0m ${data}`);
});
server.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[BACKEND ERROR]\x1b[0m ${data}`);
});

// 2. Start frontend client
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

client.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[32m[FRONTEND]\x1b[0m ${data}`);
});
client.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[FRONTEND INFO]\x1b[0m ${data}`);
});

// 3. Open browser when frontend is ready
let opened = false;
function checkFrontendAndOpen() {
  if (opened) return;
  const req = http.get('http://localhost:3000', (res) => {
    if (!opened) {
      opened = true;
      console.log('\n\x1b[32m%s\x1b[0m', '>>> Frontend is active at http://localhost:3000');
      console.log('\x1b[32m%s\x1b[0m', '>>> Backend is active at http://localhost:5000');
      console.log('\x1b[32m%s\x1b[0m\n', '>>> Opening project in default browser...');
      const openCmd = isWin ? 'start http://localhost:3000' : 'open http://localhost:3000';
      spawn(openCmd, { shell: true, detached: true });
    }
  });
  req.on('error', () => {
    setTimeout(checkFrontendAndOpen, 800);
  });
}

setTimeout(checkFrontendAndOpen, 1500);

function shutdown() {
  console.log('\nStopping servers...');
  if (server) server.kill();
  if (client) client.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
