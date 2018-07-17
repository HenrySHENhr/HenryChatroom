var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.')
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'Content-Type': mime.getType(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        console.log(absPath + ' is sent from cache.');
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        // cache[absPath] = data;
                        // console.log(absPath + ' is cached.');
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        })
    }
}

var server = http.createServer(function(request, response) {
    var filePath = false;
    if (request.url == '/') {
        filePath = 'static/index.html';
    } else {
        filePath = 'static' + request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
})

server.listen(80, function() {
    console.log('Server listening on port 80.');
})