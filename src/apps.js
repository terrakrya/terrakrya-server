/* eslint-disable no-console */
const chalk = require('chalk');
const Configstore = require('configstore');
const { existsSync } = require('fs');
const { exec } = require('shelljs');
const packageJson = require('../package.json');

const config = new Configstore(packageJson.name);
const appsDir = '~/apps/';

const getApps = () => config.get('apps') || [];

const list = () => {
  const apps = getApps();
  console.log('Configured apps');
  if (apps.length > 0) {
    console.log(chalk.bold('Configured apps:'));
    apps.forEach((app) => {
      console.log(app);
    });
  } else {
    console.log(chalk.red('Theres no one configured apps.'));
  }
};
const appExists = (appName) => getApps.find((app) => app === appName)
    && existsSync(appsDir + appName);
const add = (appName) => {
  if (appExists(appName)) {
    console.log(chalk.red(`The app ${appName} is already registered.`));
  } else {
    const apps = getApps();
    apps.push(appName);
    config.set('apps', appName);
    exec(`git -C ${appsDir} clone git@github.com:${config.get('institution')}/${appName}.git`);
  }
};
const deploy = (appName) => {
  if (!appExists(appName)) {
    add(appName);
  }
};
const status = (app) => {
  exec(`pm2 status ${app}`);
};

module.exports = {
  getApps,
  list,
  appExists,
  add,
  deploy,
  status,
};
