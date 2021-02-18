/* eslint-disable no-console */
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const homedir = require('os').homedir();

const appsDir = `${homedir}/apps/`;
const configFolderName = '.apps-config';
const configDir = `${appsDir}${configFolderName}/`;

module.exports = {
  clear: () => {
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync('Terrakrya Server', { horizontalLayout: 'full' }),
      ),
    );
  },
  help: () => {
    console.log('HELP!');
  },
  appsDir,
  configFolderName,
  configDir,
};
