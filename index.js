var burrito = require('burrito');

var jsup = module.exports = function (src) {
    var self = {};
    
    var obj = JSON.parse(src);
    var ann = jsup.annotate(src, obj);
    
    self.set = function (key, value) {
    };
    
    self.stringify = self.toString = function () {
        return (function walk (node) {
console.dir(node);
            if (Array.isArray(node)) {
                return node.node.start.line;
            }
            else if (typeof node === 'object') {
                return node.node.start.line;
            }
            else {
                return node.node.start.line;
            }
        })(ann);
    };
    
    self.inspect = function () {
        return JSON.stringify(obj);
    };
    
    return self;
};

jsup.annotate = function (src, obj) {
    if (!obj) obj = JSON.parse(src);
    
    var cursor = [ obj ];
    var root = [ Array.isArray(obj) ? [] : {} ];
    
    var path = [];
    var prevPathLen = 0;
    var rootNode = null;
    
    burrito('[\n' + src + '\n][0]', function (node) {
        var p = node.parent();
        var key = undefined;
        
        if (!p) return
        
        if (this.path.length <= prevPathLen) {
            path.pop();
            cursor.shift();
            root.shift();
            prevPathLen = path.length;
        }
        
        if (p.name === 'object') {
            var ix = this.path[ this.path.length - 2 ];
            key = p.value[0][ix][0];
        }
        else if (p.name === 'array') {
            key = this.key;
        }
        else if (p.name === 'sub' && node.value[0] !== 0) {
            rootNode = node;
            return;
        }
        else return;
        
        if (node.name === 'object' || node.name === 'array') {
            prevPathLen = this.path.length;
            path.push(key);
            
            root[0][key] = {
                node : node,
                value : node.name === 'array' ? [] : {}
            };
            root.unshift(root[0][key].value);
            cursor.unshift(cursor[0][key]);
        }
        else {
            root[0][key] = { node : node, value : cursor[0][key] };
        }
    });
    
    return { node : rootNode, value : root[root.length - 1] };
};
