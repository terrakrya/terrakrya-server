# Terrakrya server

Deploy, backup and sync scripts for production and stage enviroments for apps using node Node.js + MongoDb + PM2 + Nginx + Github stack.

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