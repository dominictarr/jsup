var burrito = require('burrito');

module.exports = function (src) {
    var self = {};
    var obj = JSON.parse(src);
    
    var cursor = [ obj ];
    var root = [ Object.create(Object.getPrototypeOf(obj)) ];
    
    var path = [];
    var prevPathLen = 0;
    
    burrito('[\n' + src + '\n][0]', function (node) {
        if (this.path.length <= prevPathLen) {
            path.pop();
            prevPathLen = path.length;
        }
        
        var p = node.parent();
        var key = undefined;
        
        if (!p) return
        else if (p.name === 'object') {
            var ix = this.path[ this.path.length - 2 ];
            key = p.value[0][ix][0];
        }
        else if (p.name === 'array') {
            key = this.key;
        }
        else if (p.name === 'sub' && node.value[0] !== 0) {
            //console.dir(node.value);
        }
        else return;
        
        if (node.name === 'object' || node.name === 'array') {
            prevPathLen = this.path.length;
            path.push(key);
        }
        console.log(path.join('/'));
    });
    
    self.set = function (key, value) {
    };
    
    self.toString = self.stringify = function () {
    };
    
    self.inspect = function () {
        return 'lul'
    };
    
    return self;
};
