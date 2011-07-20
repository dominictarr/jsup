var fs = require('fs');
var jsup = require('./');
var parse = require('uglify-js').parser.parse;

var src = fs.readFileSync(__dirname + '/stub.json', 'utf8');
var s = jsup(src)
//    .set([ 'a', 2 ], 3)
//    .set([ 'c' ], 'lul')
    .stringify()
;
console.log(s);
