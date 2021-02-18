/* eslint-disable no-console */
const chalk = require('chalk');
const Configstore = require('configstore');
const {
  existsSync, copyFileSync, rmSync, linkSync,
} = require('fs');
const { exec } = require('shelljs');
const packageJson = require('../package.json');
const { appsDir, configDir } = require('./utils');

const config = new Configstore(packageJson.name);

const getApps = () => config.get('apps') || [];

const list = () => {
  const apps = getApps();
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
  const appConfigDir = configDir + appName;
  const appDir = appsDir + appName;
  const enviroment = config.get('enviroment');
  const institution = config.get('institution');
  if (!existsSync(appConfigDir)) {
    console.log(chalk.red(`Theres no configuration folder for this app in https://github.com/${institution}/server-${enviroment}. You should create one!`));
    return;
  }

  if (!appExists(appName)) {
    add(appName);
  }

  rmSync(`/etc/nginx/sites-available/${appName}.vhost`);
  rmSync(`/etc/nginx/sites-enabled/${appName}.vhost`);
  copyFileSync(`${appConfigDir}/nginx.vhost`, `/etc/nginx/sites-available/${appName}.vhost`);
  linkSync(`/etc/nginx/sites-available/${appName}.vhost`, `/etc/nginx/sites-enabled/${appName}.vhost`);
  exec('sudo service nginx restart');

  copyFileSync(`${appConfigDir}/pm2.config.js`, `${appDir}/pm2.config.js`);
  if (!existsSync(`${appConfigDir}/.env`)) {
    copyFileSync(`${appConfigDir}/.env`, `${appDir}/.env`);
  }

  if (enviroment === 'stage') {
    // sync
  }
  // sudo cp -f ./$APP/$APP.vhost /etc/nginx/sites-available/$APP.vhost
  // sudo rm /etc/nginx/sites-enabled/$APP.vhost
  // sudo ln -s /etc/nginx/sites-available/$APP.vhost /etc/nginx/sites-enabled/$APP.vhost
  // sudo service nginx restart

  // cp ./$APP/pm2.config.js ../$APP/pm2.config.js
  // cp ./$APP/.env ../$APP/.env

  // ./sync.sh $APP

  // cd ../$APP
  // pm2 stop pm2.config.js
  // git pull
  // yarn
  // yarn build
  // yarn prepare_stage
  // yarn seed
  // pm2 start pm2.config.js
  // pm2 startup
  // pm2 save
};
const status = (app) => {
  list();
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
