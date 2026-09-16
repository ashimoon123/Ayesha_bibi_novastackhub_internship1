const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const net = require('net');
const fs = require('fs');

console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[36m%s\x1b[0m', '    Jawad Naseeb Platform - Full Stack Dev Runner     ');
console.log('\x1b[36m%s\x1b[0m', '  Database + Backend API + Middleware + Frontend UI   ');
console.log('\x1b[36m%s\x1b[0m', '=======================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

let mongoProc = null;
let serverProc = null;
let clientProc = null;

function checkPort(port, callback) {
  const socket = new net.Socket();
  let status = false;
  socket.setTimeout(1000);
  socket.on('connect', () => {
    status = true;
    socket.destroy();
    callback(true);
  });
  socket.on('timeout', () => {
    socket.destroy();
    callback(false);
  });
  socket.on('error', () => {
    callback(false);
  });
  socket.connect(port, '127.0.0.1');
}

function startDatabase(onReady) {
  checkPort(27017, (isOpen) => {
    if (isOpen) {
      console.log('\x1b[34m[DATABASE]\x1b[0m MongoDB already running on port 27017.');
      onReady();
      return;
    }

    const localAppData = process.env.LOCALAPPDATA || '';
    const mongodBin = path.join(localAppData, 'MongoDB', 'bin', 'mongod.exe');
    const mongodData = path.join(localAppData, 'MongoDB', 'data');

    if (isWin && fs.existsSync(mongodBin)) {
      console.log('\x1b[34m[DATABASE]\x1b[0m Launching local MongoDB daemon...');
      if (!fs.existsSync(mongodData)) {
        fs.mkdirSync(mongodData, { recursive: true });
      }

      mongoProc = spawn(mongodBin, ['--dbpath', mongodData], {
        stdio: ['ignore', 'pipe', 'pipe']
      });

      mongoProc.stdout.on('data', (d) => {
        const line = d.toString();
        if (line.includes('Waiting for connections')) {
          console.log('\x1b[34m[DATABASE]\x1b[0m MongoDB ready and listening on port 27017.');
        }
      });

      mongoProc.stderr.on('data', (d) => {
        process.stderr.write(`\x1b[31m[DATABASE ERROR]\x1b[0m ${d}`);
      });

      // Poll until port 27017 is accepting connections
      const checkInterval = setInterval(() => {
        checkPort(27017, (ready) => {
          if (ready) {
            clearInterval(checkInterval);
            onReady();
          }
        });
      }, 500);

      setTimeout(() => {
        clearInterval(checkInterval);
        onReady();
      }, 5000);
    } else {
      console.log('\x1b[34m[DATABASE]\x1b[0m Connecting using configured MONGO_URI in server/.env');
      onReady();
    }
  });
}

function startBackend() {
  console.log('\x1b[35m[BACKEND]\x1b[0m Starting Express API server...');
  serverProc = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.join(__dirname, 'server'),
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });

  serverProc.stdout.on('data', (d) => {
    process.stdout.write(`\x1b[35m[BACKEND]\x1b[0m ${d}`);
  });
  serverProc.stderr.on('data', (d) => {
    process.stderr.write(`\x1b[31m[BACKEND ERROR]\x1b[0m ${d}`);
  });
}

function startFrontend() {
  console.log('\x1b[32m[FRONTEND]\x1b[0m Starting Vite React client...');
  clientProc = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.join(__dirname, 'client'),
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });

  clientProc.stdout.on('data', (d) => {
    process.stdout.write(`\x1b[32m[FRONTEND]\x1b[0m ${d}`);
  });
  clientProc.stderr.on('data', (d) => {
    process.stderr.write(`\x1b[33m[FRONTEND]\x1b[0m ${d}`);
  });
}

let browserOpened = false;
function checkFrontendAndOpen() {
  if (browserOpened) return;
  const req = http.get('http://localhost:3000', () => {
    if (!browserOpened) {
      browserOpened = true;
      console.log('\n\x1b[32m%s\x1b[0m', '>>> Frontend UI: http://localhost:3000');
      console.log('\x1b[35m%s\x1b[0m', '>>> Backend API: http://localhost:5000');
      console.log('\x1b[34m%s\x1b[0m', '>>> Database:    mongodb://127.0.0.1:27017/jawadnaseeb');
      console.log('\x1b[36m%s\x1b[0m\n', '>>> Opening application in your default browser...');
      const openCmd = isWin ? 'start http://localhost:3000' : 'open http://localhost:3000';
      spawn(openCmd, { shell: true, detached: true });
    }
  });
  req.on('error', () => {
    setTimeout(checkFrontendAndOpen, 800);
  });
}

// Sequence: Database -> Backend & Frontend -> Browser
startDatabase(() => {
  startBackend();
  startFrontend();
  setTimeout(checkFrontendAndOpen, 1500);
});

function shutdown() {
  console.log('\n\x1b[33mStopping all services...\x1b[0m');
  if (clientProc) {
    try { isWin ? spawn('taskkill', ['/pid', clientProc.pid, '/f', '/t']) : clientProc.kill(); } catch (e) {}
  }
  if (serverProc) {
    try { isWin ? spawn('taskkill', ['/pid', serverProc.pid, '/f', '/t']) : serverProc.kill(); } catch (e) {}
  }
  if (mongoProc) {
    try { isWin ? spawn('taskkill', ['/pid', mongoProc.pid, '/f', '/t']) : mongoProc.kill(); } catch (e) {}
  }
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
