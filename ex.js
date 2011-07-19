var fs = require('fs');
var jsup = require('./');
var parse = require('uglify-js').parser.parse;

var src = fs.readFileSync(__dirname + '/stub.json', 'utf8');
var s = jsup(src).stringify();
console.log(s);
