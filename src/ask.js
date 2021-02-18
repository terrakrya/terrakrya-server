const inquirer = require('inquirer');

module.exports = {
  enviroment: async () => {
    const res = await inquirer.prompt([
      {
        type: 'list',
        name: 'enviroment',
        message: 'Select the enviroment for this server:',
        choices: ['production', 'stage'],
        validate(value) {
          if (value) {
            return true;
          }
          return 'Please select the enviroment';
        },
      },
    ]);
    return res.enviroment;
  },
  institution: async () => {
    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'institution',
        message: 'Insert your Github institution or username where the projects is hosted:',
        validate(value) {
          if (value) {
            return true;
          }
          return 'Please insert your Github institution or username';
        },
      },
    ]);
    return res.institution;
  },
  purge: async () => {
    const res = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'purge',
        default: false,
        message: 'This command will delete all files and configuration. Are you sure you want to continue?',
      },
    ]);
    return res.purge;
  },
};
