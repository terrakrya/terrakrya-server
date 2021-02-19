# Terrakrya server

Deploy, backup and sync scripts for production and stage enviroments for apps using node Node.js + MongoDb + PM2 + Nginx + Github stack.

## Install dependencies

```
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -

sudo snap install core
sudo snap refresh core
sudo apt-get remove certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

sudo apt update
sudo apt install -y nodejs gnupg mongodb nginx certbot python3-certbot-nginx backblaze-b2 unzip python2 build-essential
npm i -g yarn pm2
sudo fuser -k 80/tcp
sudo fuser -k 443/tcp

```

# Installation
```
npm i @terrakrya/server@latest -g
```

## commands
```
## show apps status
$ terrakrya

# List active apps
$ terrakrya apps

# Register an application
$ terrakrya add app-name

# Deploy an application
$ terrakrya deploy app-name

# Backup an application
$ terrakrya backup app-name

# Sync stage enviroment for an application
$ terrakrya sync app-name

# Show apps status
$ terrakrya status 

# Remove all application and configuration files
$ terrakrya purge

# Show help
$ terrakrya help

```