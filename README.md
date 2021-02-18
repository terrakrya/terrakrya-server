# Terrakrya server

Deploy, backup and sync scripts for production and stage enviroments for apps using node Node.js + MongoDb + PM2 + Nginx + Github stack.

## Requirements

```
apt update
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install gnupg
sudo apt install mongodb -y
apt install nginx -y
```

# Installation
```
npm i @terrakrya/server -g
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