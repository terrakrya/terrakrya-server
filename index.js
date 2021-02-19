#!/usr/bin/env node
/* eslint-disable no-console */

const configure = require('./src/configure');
const apps = require('./src/apps');
const utils = require('./src/utils');

const run = async () => {
  utils.clear();

  await configure.check();

  const params = process.argv;
  const command = params[2];
  const app = params[3];

  if (command) {
    switch (command) {
      case 'apps': apps.list(); break;
      case 'add': apps.add(app); break;
      case 'deploy': await apps.deploy(app); break;
      case 'backup': apps.backup(app); break;
      case 'sync': apps.sync(app); break;
      case 'status': apps.status(app); break;
      case 'cert': await apps.appCert(); break;
      case 'purge': await utils.purge(); break;
      case 'help': utils.help(); break;
      default: utils.help(); break;
    }
  } else {
    apps.status();
  }
  process.exit();
};

run();
