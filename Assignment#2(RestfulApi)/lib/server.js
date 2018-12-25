/**
 * this file contains server related logic for handling request
 * 
 */
const http = require('http');
const https = require('https');
const url = require('url');
const config = require('./config');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf-8');
const helpers = require('./helpers');
const fs = require('fs');
const handlers = require('./handlers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

//init server with empty object
let server = {};
server.httpServer = http.createServer(function (req, res) {
    server.commonServer(req, res);
});

server.commonServer = function (req, res) {
    let parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);
    //requested path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get query string from object
    let queryStringObject = parsedUrl.query;

    //method of the request
    let requestMethod = req.method.toLowerCase();

    //headers of request
    let headers = req.headers;

    let dataBuffer = ''
    //get data-payload from the request
    req.on('data', function (data) {
        dataBuffer += decoder.write(data);
    });

    req.on('end', function () {
        dataBuffer += decoder.end();

        let chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': requestMethod,
            'headers': headers,
            'payload': helpers.parseJsonToObject(dataBuffer)
        };

        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            let payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });

};

//defining router for the requests at different paths
server.router = {
    'users': handlers.users,
    'tokens': handlers.tokens,
    'order': handlers.orders
};


server.init = function () {
    server.httpServer.listen(config.httpPort, function () {
        console.log(`Http server is running on port number ${config.httpPort}`);
    });
};

module.exports = server;