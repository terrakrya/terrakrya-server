const inquirer = require('inquirer');

const homeDir = require('os').homedir();

module.exports = {
  enviroment: async () => {
    const res = await inquirer.prompt([
      {
        type: 'list',
        name: 'enviroment',
        message: 'Select the enviroment for this server:',
        choices: ['production', 'stage'],
        default: 'stage',
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
        default: 'terrakrya',
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
  confirmPurge: async () => {
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
  copyKeys: async () => {
    const res = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'copyKeys',
        default: false,
        message: `Attention! Do you want to copy the server configuration keys replacing the server keys in ${homeDir}/.ssh/`,
      },
    ]);
    return res.copyKeys;
  },
  keyConfigured: async () => {
    const res = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'keyConfigured',
        default: true,
        message: 'Have you added the the public ssh key to the Github?',
      },
    ]);
    return res.keyConfigured;
  },
  appDomain: async () => {
    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'appDomain',
        message: 'Insert your application domain root domain:',
        default: 'terrakrya.com',
        validate(value) {
          if (value) {
            return true;
          }
          return 'Please insert your root domain';
        },
      },
    ]);
    return res.appDomain;
  },
  confEmail: async () => {
    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'confEmail',
        message: 'Insert your institution email:',
        default: 'suporte@terrakrya.com',
        validate(value) {
          if (value) {
            return true;
          }
          return 'Please insert your email';
        },
      },
    ]);
    return res.confEmail;
  },
};
