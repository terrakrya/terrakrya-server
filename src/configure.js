/* eslint-disable no-console */
const Configstore = require('configstore');
const chalk = require('chalk');
const { existsSync } = require('fs');
const { exec } = require('shelljs');
const ask = require('./ask');
const {
  homeDir, appsDir, configDir, configFolderName,
} = require('./utils');

const packageJson = require('../package.json');

const config = new Configstore(packageJson.name);

const checkAppsDir = async () => {
  if (!existsSync(appsDir)) {
    exec(`mkdir ${appsDir}`);
  }
};

const copyKeys = async () => {
  const confirmed = await ask.copyKeys();
  if (confirmed) {
    exec(`cat ${configDir}.ssh/authorized_keys >> ${homeDir}/.ssh/authorized_keys`);
  }
};

const checkKeys = async () => {
  if (!existsSync(`${homeDir}/.ssh/id_rsa`)) {
    console.log('There is no one ssh key configured on this server. Generating one...');
    exec(`ssh-keygen -t rsa -b 4096 -C "support@${config.get('institution')}.com" -f ${homeDir}/.ssh/id_rsa -N '' `);
  }
  console.log('Now you should add the key below to your Github account. https://github.com/settings/ssh/new');
  exec(`cat ${homeDir}/.ssh/id_rsa.pub`);
  await ask.keyConfigured();
};

const checkEnviroment = async () => {
  let enviroment = config.get('enviroment');
  if (!enviroment) {
    enviroment = await ask.enviroment();
    config.set('enviroment', enviroment);
  }
  console.log(`${chalk.bold('Enviroment: ')} ${enviroment === 'production' ? chalk.green(enviroment) : chalk.yellow(enviroment)}`);
  return enviroment;
};

const checkInstitution = async () => {
  let institution = config.get('institution');
  if (!institution) {
    institution = await ask.institution();
    config.set('institution', institution);
  }
  console.log(`${chalk.bold('Institution/username: ')} ${chalk.yellow(institution)}`);
  return institution;
};

const checkEmail = async () => {
  let email = config.get('email');
  if (!email) {
    email = await ask.confEmail();
    config.set('email', email);
  }
  console.log(`${chalk.bold('Email: ')} ${chalk.yellow(email)}`);
  return email;
};

const checkConfigRepository = async () => {
  const enviroment = config.get('enviroment');
  if (!existsSync(`${configDir}`)) {
    await checkKeys();
    exec(`git -C ${appsDir} clone git@github.com:${config.get('institution')}/server-${enviroment}.git ${configFolderName}`);
    await copyKeys();
  }
};

const check = async () => {
  await checkAppsDir();
  await checkEnviroment();
  await checkInstitution();
  await checkEmail();
  await checkConfigRepository();
};

module.exports = {
  check,
};
