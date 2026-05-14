const { spawn } = require('child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];

function run(name, args) {
  const child = spawn(npmCommand, args, {
    stdio: 'inherit',
    shell: true,
  });

  children.push(child);

  child.on('exit', (code, signal) => {
    if (signal) {
      return;
    }

    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });
}

function shutdown(code = 0) {
  children.forEach((child) => {
    if (!child.killed) {
      child.kill();
    }
  });

  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('server', ['run', 'server']);
run('client', ['run', 'client']);
