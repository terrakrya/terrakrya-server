/* eslint-disable no-console */

const configure = require('./src/configure');
const apps = require('./src/apps');
const utils = require('./src/utils');

const run = async () => {
  utils.clear();

  await configure.check();

  const params = process.argv;
  const command = params[2];
  const app = params[2];

  if (command) {
    switch (command) {
      case 'apps': apps.list(); break;
      case 'add': apps.add(app); break;
      case 'deploy': apps.deploy(app); break;
      case 'status': apps.status(app); break;
      default: utils.help(); break;
    }
  } else {
    apps.status();
  }
};

run();
