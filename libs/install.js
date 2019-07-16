const ora = require('ora');
const { spawn } = require('child_process');

module.exports = cwd => new Promise((resolve, reject) => {
  const spinner = ora('npm installing, wait a sec..');
  spinner.start();

  const npm = spawn('npm.cmd', [
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
    spinner.text = `successfully installed! ${code === 0 ? '' : `(Exit Code: ${code})`}`;
    spinner.succeed();
    resolve();
  });
});
