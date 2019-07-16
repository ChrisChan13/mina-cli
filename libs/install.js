const os = require('os');
const ora = require('ora');
const { spawn } = require('child_process');

module.exports = cwd => new Promise((resolve, reject) => {
  const spinner = ora('npm installing, wait a sec..');
  spinner.start();

  const npm = spawn(os.type() === 'Windows_NT' ? 'npm.cmd' : 'npm', [
    'install',
    '-D',
    'eslint',
    'eslint-config-airbnb-base',
    'eslint-plugin-import',
  ], { cwd });

  npm.on('error', (err) => {
    spinner.text = 'failed to install, see the Error below:';
    spinner.fail();
    reject(err);
  });

  npm.stdout.on('data', (data) => {
    console.log();
    console.log(`${data}`);
  });

  npm.on('close', (code) => {
    if (code === 0) {
      spinner.text = 'successfully installed!';
      spinner.succeed();
      resolve();
    } else {
      reject(code);
    }
  });
});
