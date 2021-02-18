/* eslint-disable no-console */
const Configstore = require('configstore');
const chalk = require('chalk');
const { existsSync } = require('fs');
const { exec } = require('shelljs');
const packageJson = require('../package.json');
const ask = require('./ask');

const appsDir = '~/apps/';

const config = new Configstore(packageJson.name);

const checkEnviroment = async () => {
  let enviroment = config.get('enviroment');
  if (!enviroment) {
    enviroment = await ask.enviroment();
    config.set('enviroment', enviroment);
  }
  console.log(`${chalk.bold('Enviroment: ')} ${enviroment === 'production' ? chalk.green(enviroment) : chalk.orange(enviroment)}`);
  return enviroment;
};

const checkInstitution = async () => {
  let institution = config.get('institution');
  if (!institution) {
    institution = await ask.institution();
    config.set('institution', institution);
  }
  console.log(`${chalk.bold('institution: ')} ${chalk.green(institution)}`);
  return institution;
};

const checkConfigRepository = async () => {
  const enviroment = config.get('enviroment');
  if (!existsSync(`${appsDir}.apps-config/`)) {
    exec(`git -C ${appsDir} clone git@github.com:${config.get('institution')}/server-${enviroment}.git .apps-config`);
  }
};

const checkAppsDir = async () => {
  if (!existsSync(appsDir)) {
    exec(`mkdir ${appsDir}`);
  }
};

const check = async () => {
  await checkAppsDir();
  await checkEnviroment();
  await checkInstitution();
  await checkConfigRepository();
};

module.exports = {
  check,
};
