#!/usr/bin/env node
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const symbols = require('log-symbols');
const handlebars = require('handlebars');
// const { exec } = require('child_process');
const download = require('download-git-repo');

program.version('1.0.1', '-v --version').usage('[options]');

program.command('create <name>')
  .action((name) => {
    const dir = `${process.cwd()}/${name}`;
    if (!fs.existsSync(dir)) {
      inquirer.prompt([
        {
          name: 'name',
          message: 'minapp\'s name',
        },
        {
          type: 'confirm',
          name: 'eslint',
          message: 'using eslint?',
        },
      ]).then((answers) => {
        const spinner = ora('Downloading template..');
        spinner.start();
        download('github:ChrisChan13/minapp-template', dir, (err) => {
          if (err) {
            spinner.text = 'Error on downloading';
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          } else {
            spinner.text = 'Template downloaded';
            spinner.succeed();
            if (!answers.eslint) {
              fs.unlink(`${dir}/.eslintrc.js`, () => {});
            }
            const meta = {
              name: answers.name,
            };
            const content = fs.readFileSync(`${dir}/app.json`).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(`${dir}/app.json`, result);
            console.log(symbols.success, chalk.green(`Project ${name} created at: ${dir}`));
            if (answers.eslint) {
              console.log(symbols.info, chalk.cyan('For using eslint, make sure you have the following dependencies:'));
              console.log(chalk.cyan('    eslint eslint-config-airbnb-base eslint-plugin-import'));
            }
          }
        });
      });
    } else {
      console.log(symbols.error, chalk.red(`Project named ${name} has already existed at current path`));
    }
  });

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log('  Run: \'mina create demo\', to create a new project named \'demo\'');
});

program.parse(process.argv);
