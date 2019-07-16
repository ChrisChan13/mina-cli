const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const download = require('download-git-repo');

module.exports = (repo, dir) => new Promise((resolve, reject) => {
  const spinner = ora('downloading template..');
  spinner.start();
  download(repo, dir, (err) => {
    if (err) {
      spinner.text = 'failed to download, see the Error below:';
      spinner.fail();
      console.log(symbols.error, chalk.red(err));
      reject();
    } else {
      spinner.text = 'tempalte downloaded!';
      spinner.succeed();
      resolve();
    }
  });
});
