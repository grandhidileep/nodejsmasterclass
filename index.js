const http = require('http');
const url = require('url');
const port = 3000;
const httpServer = http.createServer(function (req, res) {
    requestHandler(req, res);
});

let handler = {};
handler.helloworld = function (callback) {
    callback(200, 'Hello World');
}

handler.notfound = function (callback) {
    callback(404);
}

let router = {
    'hello': handler.helloworld
}

let requestHandler = function (req, res) {
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    req.on('end', function () {
        let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? handler.helloworld : handler.notfound;
        console.log(`chosen handler : ${chosenHandler}`);
        chosenHandler(function (statusCode, payload) {
            res.writeHead(statusCode);
            console.log(`statuscode : ${statusCode} payload : ${payload}`);
            res.end(payload);
        })
    })
}

httpServer.listen(port, function () {
    console.log(`listening on port ${port}`);
})