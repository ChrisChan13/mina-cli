#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const symbols = require('log-symbols');
const handlebars = require('handlebars');

const npm = require('./libs/npm');
const install = require('./libs/install');
const download = require('./libs/download');

program.version('1.0.1', '-v, --version').usage('[options]');

program.command('create <name>')
  .action((name) => {
    const dir = `${process.cwd()}\\${name}`;
    if (fs.existsSync(dir)) {
      console.log(symbols.error, chalk.red(`project named ${name} has already existed at current path`));
      return;
    }
    inquirer.prompt([
      {
        name: 'name',
        message: 'minapp\'s name',
      },
      {
        type: 'confirm',
        name: 'plugin',
        message: 'using plugin?',
      },
      {
        type: 'confirm',
        name: 'eslint',
        message: 'using eslint?',
      },
    ]).then(async (answers) => {
      await download('github:ChrisChan13/minapp-template', dir);
      if (answers.plugin) {
        fs.unlinkSync(`${dir}\\utils\\sdk.js`);
      } else {
        fs.unlinkSync(`${dir}\\utils\\sdk-plugin.js`);
      }
      if (!answers.eslint) {
        fs.unlinkSync(`${dir}\\.eslintrc.js`);
      }
      const meta = {
        name: answers.name,
      };
      const content = fs.readFileSync(`${dir}\\app.json`).toString();
      const result = handlebars.compile(content)(meta);
      fs.writeFileSync(`${dir}\\app.json`, result);
      console.log(symbols.success, chalk.green(`project ${name} created at ${dir}`));
      if (answers.eslint) {
        console.log(symbols.info, chalk.cyan('for using eslint, make sure you have the following Dependencies:'));
        console.log(chalk.cyan('    eslint eslint-config-airbnb-base eslint-plugin-import'));
        return inquirer.prompt([{
          type: 'confirm',
          name: 'install',
          message: 'install them now?',
        }]);
      }
      return Promise.resolve(false);
    }).then(async (answers) => {
      if (answers && answers.install) {
        await npm(dir);
        await install(dir);
      }
    }).catch((err) => {
      if (err) {
        console.log(symbols.error, chalk.red(err.message));
      }
    });
  });

program.on('--help', () => {
  console.log();
  console.log('examples:');
  console.log();
  console.log('  run \'mina create demo\', to create a new project named \'demo\'');
});

program.parse(process.argv);
