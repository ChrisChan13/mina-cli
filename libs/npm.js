const ora = require('ora');
const { exec } = require('child_process');

module.exports = cwd => new Promise((resolve, reject) => {
  const spinner = ora('npm initializing..');
  spinner.start();
  exec('npm init -y', { cwd }, (err, stdout) => {
    if (err) {
      spinner.text = 'failed to initialize, see the Error below:';
      spinner.fail();
      reject(err);
    } else {
      spinner.text = 'successfully initialized!';
      spinner.succeed();
      console.log(stdout);
      resolve();
    }
  });
});
