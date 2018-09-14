#!/usr/bin/env node
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const program = require('commander');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const download = require('download-git-repo');

program.version('1.0.0', '-v --version')
  .command('create <name>')
  .action((name) => {
    const dir = `${process.cwd()}/${name}`;
    if (!fs.existsSync(dir)) {
      inquirer.prompt([
        {
          name: 'name',
          messages: 'minapp\'s name?',
        },
      ]).then((answers) => {
        const spinner = ora('Downloading template..');
        spinner.start();
        download('github:ChrisChan13/minapp-template', dir, (err) => {
          if (err) {
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          } else {
            spinner.succeed();
            const meta = {
              name: answers.name,
            };
            const content = fs.readFileSync(`${dir}/app.json`).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(`${dir}/app.json`, result);
            console.log(symbols.success, chalk.green(`Project ${name} created at: ${dir}`));
          }
        });
      });
    } else {
      console.log(symbols.error, chalk.red(`Project ${name} already exist at: ${dir}`));
    }
  });
program.parse(process.argv);
