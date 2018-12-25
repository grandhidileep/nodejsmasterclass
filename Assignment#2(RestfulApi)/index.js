/**
 * Root file for api
 */

// importing dependencies
const server = require('./lib/server');

let app = {};
//initializing the application
app.init = function () {
    server.init();
}

app.init();

//export the application
module.export = app ;