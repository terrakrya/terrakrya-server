/* eslint-disable no-console */
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

module.exports = {
  clear: () => {
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync('Terrakrya Server', { horizontalLayout: 'full' }),
      ),
    );
  },
};
