# frontend
This repository contains all the code for the frontend of our program. The frontend is the site that the users will see (where the backend is the server that serves the site).

## Framework
The site is built on the Mithril framework and packaged using Webpack. Styling is done using SCSS, which is a version of Sass. Babel is used to compile the code into something even old browsers understand.

## Testing
To test the frontend you will first have to install NodeJS. When installing NodeJS the package manager NPM is also automatically installed. After pulling the latest version of the repository you can use the following commands (make sure to run these commands in the frontend folder):
```bash
# Installs the dependencies
$ npm install
```
And then:
```bash
# Start running the test server on localhost:8080
$ npm test
```

## The structure
The files are structured in a way that it is easy to build upon. The following is an explanation of what goes where:
```bash
|
|- build/ # Contains all the build scripts and the configuration files that go with them.
| |- build.js # The production build script
| |- build.dev.js # The development build script
| |- webpack.base.conf.js # The webpack configuration that both development and production have in common
| |- webpack.dev.conf.js # The development webpack configuration and is merged with the base config
| |- webpack.prod.conf.js # The production webpack configuration and is merged with the base config
|- dist/ # When the site is built, the built files will be added to this folder
|- node_modules/ # Contains the modules that can be used in the code, which are excluded from the git repo
|- resources/ # Contains all the resources for this size, like fonts, images and styling sheets
| |- images/ # Contains all the images used in the site
| |- scss/ # Contains the styling sheets
| | |- stylesheet.scss # The main styling sheet
|- src/ # Contains the source code
| |- ui/ # All code to do with the ui
| | |- components/ # The individual components
| | |- views/ # The different web pages or "views"
| | |- handler.js # The file that handles the ui
| |- visualize/ # All code to with organising the visualizations
| |- DataHandler.js # Organizes the dataset
| |- index.html # The html file, which will probably be the only html file we need
| |- index.js # The main file, here the code is started (like the main function in Java)
|- .babelrc # The configuration file for Babel
|- .gitignore # Tells git which files to ignore, like the installed packages
|- generator.js # A script to generate bigger datasets
|- package-lock.json # An automatically generated file keeping track of the dependencies
|- package.json # The configuration for NPM
|- README.md # This file
```

## Features
There is a button with which data can be selected. There is a node-link diagram that has nodes that can be clicked on to view the connected nodes. There is also a hierarchical edge bundling diagram which shows the people that have messages eachother, grouped by job title. Using the time bar below a certain time span can be selected.
