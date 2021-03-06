 # Syncway v1.0.6


The frontend is generated with [Angular CLI](https://github.com/angular/angular-cli). The backend is made from scratch. Whole stack in [TypeScript](https://www.typescriptlang.org).

This project uses the stack:
* [**L**oki.js](http://lokijs.org): Javascripr file database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 4](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment

Other tools and technologies used:
* [Angular CLI](https://cli.angular.io): frontend scaffolding
* [Bootstrap](http://www.getbootstrap.com): layout and styles
* [Font Awesome](http://fontawesome.io): icons
* [JSON Web Token](https://jwt.io): user authentication
* [Angular 2 JWT](https://github.com/auth0/angular2-jwt): JWT helper for Angular
* [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js): password encryption

## DataBase
* It is using a Loki DB which save data to files inside directory data
* This files can be external edited then application will automatically reload DataBase 

## Prerequisites
1. Install [Node.js](https://nodejs.org) ^8.9.4 
2. Install Angular CLI: `npm i -g @angular/cli`
3. From project root folder install all the dependencies: `npm i`


## Run
### Development mode
`npm run dev`: [concurrently](https://github.com/kimmobrunfeldt/concurrently) execute Angular build, TypeScript compiler and Express server.

A window will automatically open at [localhost:4200](http://localhost:4200). Angular and Express files are being watched. Any change automatically creates a new bundle, restart Express server and reload your browser.

### Production mode
`npm run prod`: compile the project with a production bundle and AOT compilation 
`node dist/server/app.js run the project listening at [localhost:3000](http://localhost:3000)

***At first tim you must execute as dev bundle to can create admin user***
 
## Create package
 `npm i`: install all dependencies
 `npm run prod`: compile angular files
 `del node_modules`: remove all dev dependencies
 `npm i --production`: install only production dependencies
 `npm zip` create package
 
## Deploy
1. Extract file `bin/Syncway.zip`
2. go to extracted folder 
3. execute 
4. `install.bat`
5. `start.bat`


## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `npm start`.

## Running TSLint
Run `ng lint` to execute the linter via [TSLint](https://palantir.github.io/tslint/).

## Further help
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Author
* [Ítalo Castilho](https://github.com/icastilho)
