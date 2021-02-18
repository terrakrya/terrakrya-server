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
    return res.institution;
  },
  institution: async () => {
    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'enviroment',
        message: 'Insert your Github institution or username where the projects is hosted:',
        validate(value) {
          if (value) {
            return true;
          }
          return 'Please insert your Github institution or username';
        },
      },
    ]);
    return res.enviroment;
  },
};
