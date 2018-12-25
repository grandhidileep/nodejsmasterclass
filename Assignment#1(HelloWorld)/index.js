//requiring the modules
const http = require('http');
const url = require('url');
let handlers = {};

handlers.notFound = function (data, callback) {
    callback(404);
}
handlers.helloworld = function (data, callback) {
    console.log(`${JSON.stringify(data)}`);
    callback(200, {
        "response": "Hello World"
    });
}
let router = {
    'hello': handlers.helloworld
}
const server = http.createServer(function (req, res) {
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    let method = req.method.toLocaleLowerCase();
    let buffer = '';
    
    let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    if (method !== 'post') {
        chosenHandler = handlers.notFound;
    }
    chosenHandler(buffer, function (statusCode, payload) {
        statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
        payload = typeof (payload) == 'object' ? payload : {};
        res.writeHead(statusCode);
        var payloadStr = JSON.stringify(payload);
        res.end(payloadStr);
    });
})
server.listen(3000, function () {
    console.log('listening on port 3000!');
})