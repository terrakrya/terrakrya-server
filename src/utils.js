/* eslint-disable no-console */
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const Configstore = require('configstore');
const homeDir = require('os').homedir();
const { rmdirSync } = require('fs');
const { cd, exec } = require('shelljs');
const ask = require('./ask');

const packageJson = require('../package.json');

const config = new Configstore(packageJson.name);

const appsDir = `${homeDir}/apps/`;
const configFolderName = '.apps-config';
const configDir = `${appsDir}${configFolderName}/`;
const dumpsDir = `${appsDir}.dumps/`;

module.exports = {
  clear: () => {
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync('Terrakrya Server', { horizontalLayout: 'full' }),
      ),
    );
  },
  purge: async () => {
    const confirmed = await ask.purge();
    if (confirmed) {
      config.clear();
      rmdirSync(appsDir, { recursive: true });
      console.log(chalk.green('Purge executed successfuly!'));
    }
  },
  updateConf: async () => {
    cd(configDir);
    exec('git pull');
  },
  help: () => {
    console.log('HELP!');
  },
  homeDir,
  appsDir,
  configFolderName,
  configDir,
  dumpsDir,
};
