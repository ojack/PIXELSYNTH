var s = require('node-static');
var http = require('http');
var file = new(s.Server)();

console.log("server running on port " + 2013);
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(2013);