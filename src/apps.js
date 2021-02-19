/* eslint-disable no-console */
const chalk = require('chalk');
const Configstore = require('configstore');
const {
  existsSync, copyFileSync, rmSync, linkSync, mkdirSync,
} = require('fs');
const { exec, cd } = require('shelljs');
const ask = require('./ask');
const packageJson = require('../package.json');
const {
  homeDir, appsDir, configDir, dumpsDir, updateConf,
} = require('./utils');

const config = new Configstore(packageJson.name);

const currentDate = () => {
  const d = new Date();
  return [d.getFullYear(), d.getMonth(), d.getMonth(), d.getHours() + d.getMinutes()].join('-');
};
const list = () => {
  console.log(chalk.bold('Configured apps: '));
  cd(appsDir);
  exec('ls');
};
const appCert = async () => {
  const domain = await ask.appDomain();
  exec(`sudo certbot --nginx --agree-tos -d ${domain} -m ${config.get('email') || 'suporte@terrakrya.com'}`);
};
const appExists = (appName) => existsSync(appsDir + appName);
const add = async (appName) => {
  if (appExists(appName)) {
    console.log(chalk.red(`The app ${appName} is already registered.`));
  } else {
    exec(`git -C ${appsDir} clone git@github.com:${config.get('institution')}/${appName}.git`);
    cd(`${appsDir}${appName}/`);
    exec('git checkout main');
    exec('git pull');
    cd(homeDir);
    await appCert();
  }
  console.log(chalk.green(`App ${appName} executed successfuly!`));
};
const sync = (appName) => {
  const institution = config.get('institution');
  if (!existsSync(`${dumpsDir}`)) {
    mkdirSync(dumpsDir);
  }
  const appDumpsDir = `${dumpsDir}/${appName}/`;
  if (!existsSync(`${dumpsDir}`)) {
    mkdirSync(appDumpsDir);
  }
  exec(`backblaze-b2 sync --replaceNewer b2://${institution}/${appName}/dumps/ ${appDumpsDir}`);
  exec(`backblaze-b2 sync --replaceNewer b2://${institution}/${appName}/uploads/ ${appsDir}/${appName}/api/uploads/`);
  exec(`mongorestore --archive=${appDumpsDir}${appName}-latest.zip --gzip --db ${appName} --drop`);
  console.log(chalk.green('Backup executed successfuly!'));
};

const backup = (appName) => {
  const institution = config.get('institution');
  const date = currentDate();
  const uploadsDir = `${appsDir + appName}/api/uploads/`;
  const dumpDir = `${dumpsDir + appName}/`;
  const dumpFile = `${dumpDir}${appName}-${date}.zip`;
  exec(`mongodump -d ${appName} --gzip --archive=${dumpFile}`);
  copyFileSync(dumpFile, `${appName}-latest.zip`);
  rmSync(`${uploadsDir}${appName}-uploads.zip`);
  exec(`zip -r ${uploadsDir}${appName}-uploads.zip ${uploadsDir}*`);
  exec(`backblaze-b2 sync --keepDays 0 --replaceNewer ${dumpDir} "b2://${institution}/${appName}/dumps/`);
  exec(`backblaze-b2 sync --keepDays 0 --replaceNewer ${uploadsDir} "b2://${institution}/${appName}/uploads/`);
  console.log(chalk.green('Backup executed successfuly!'));
};
const deploy = async (appName) => {
  updateConf();
  const appConfigDir = `${configDir + appName}/`;
  const appDir = `${appsDir + appName}/`;
  const enviroment = config.get('enviroment');
  const institution = config.get('institution');

  if (!appName) {
    console.log(chalk.red('Please insert the app name in the second param'));
    return;
  }

  if (!existsSync(appConfigDir)) {
    console.log(chalk.red(`Theres no configuration folder for this app in https://github.com/${institution}/server-${enviroment}. You should create one!`));
    return;
  }

  if (!appExists(appName)) {
    await add(appName);
  }

  if (existsSync(`/etc/nginx/sites-available/${appName}.vhost`)) {
    rmSync(`/etc/nginx/sites-available/${appName}.vhost`);
  }
  if (existsSync(`/etc/nginx/sites-enabled/${appName}.vhost`)) {
    rmSync(`/etc/nginx/sites-enabled/${appName}.vhost`);
  }
  copyFileSync(`${appConfigDir}nginx.vhost`, `/etc/nginx/sites-available/${appName}.vhost`);
  linkSync(`/etc/nginx/sites-available/${appName}.vhost`, `/etc/nginx/sites-enabled/${appName}.vhost`);
  exec('sudo service nginx restart');

  copyFileSync(`${appConfigDir}pm2.config.js`, `${appDir}pm2.config.js`);
  if (existsSync(`${appConfigDir}.env`)) {
    copyFileSync(`${appConfigDir}.env`, `${appDir}.env`);
  }

  if (enviroment === 'stage') {
    // sync
    sync(appName);
  } else {
    backup(appName);
  }
  cd(appDir);
  exec('pm2 stop pm2.config.js');
  exec('git pull');
  exec('yarn');
  exec('yarn build');
  exec('yarn seed');
  exec('pm2 start pm2.config.js');
  exec('pm2 startup');
  exec('pm2 save');
  console.log(chalk.green('Deploy executed successfuly!'));
};

const status = (app) => {
  list();
  exec(`pm2 status ${app}`);
};

module.exports = {
  list,
  appExists,
  add,
  deploy,
  status,
  sync,
  backup,
  appCert,
};
