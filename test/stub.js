var assert = require('assert');
var fs = require('fs');
var jsup = require('../');

var src = fs.readFileSync(__dirname + '/stub.json', 'utf8');

exports.stub = function () {
    assert.equal(jsup(src).stringify(), src);
    
    assert.equal(
        jsup(src)
            .set([ 'a', 2 ], 3)
            .stringify()
        ,
        src.replace('333333', '3')
    );
    
    assert.equal(
        jsup(src)
            .set([ 'a', 2 ], 3)
            .set([ 'c' ], 'lul')
            .stringify()
        ,
        src.replace('333333', '3').replace('444444', '"lul"')
    );
};
