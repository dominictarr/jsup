var burrito = require('burrito');
var traverse = require('traverse');

var jsup = module.exports = function (src) {
    var self = {};
    
    var obj = JSON.parse(src);
    var ann = jsup.annotate(src, obj);
    
    self.set = function (path, value) {
        var cur = ann;
        var curs = [ cur ];
        traverse(obj).set(path, value);
        
        var ps = [];
        for (var i = 0; i < path.length - 1; i++) {
            var key = path[i];
            if (!Object.hasOwnProperty.call(cur.value, key)) break;
            ps.push(key);
            cur = cur.value[key];
            curs.unshift(cur);
        }
        var res = traverse(obj).get(ps);
        
        var before = src.slice(0, cur.node.start.pos - 2);
        var after = src.slice(cur.node.end.pos - 1);
        src = before + JSON.stringify(res) + after;
        
console.log('before=<' + before + '>');
console.log('after=<' + after + '>');
console.log('src=<' + src + '>');
        
        ann = jsup.annotate(src, obj);
        
        return self;
    };
    
    self.stringify = self.toString = function () {
        return src;
    };
    
    self.inspect = function () {
        return 'jsup(\'' + JSON.stringify(obj) + '\')';
    };
    
    return self;
};

jsup.annotate = function (src, obj) {
    if (!obj) obj = JSON.parse(src);
    
    var cur = obj;
    var root = { value : Array.isArray(obj) ? [] : {} };
    
    burrito('[\n' + src + '\n][0]', function (node) {
        var p = node.parent();
        
        if (p && p.name === 'sub' && node.value[0] !== 0) {
            root.node = node;
        }
        if (node.start.pos < 2 || node.end.pos > src.length - 5) return;
        
        var key = undefined;
        
        if (p.name === 'object') {
            var ix = this.path[ this.path.length - 2 ];
            key = p.value[0][ix][0];
        }
        else if (p.name === 'array') {
            key = this.key;
        }
        else throw new Error('unexpected name')
        
        if (node.name === 'object' || node.name === 'array') {
            root.value[key] = {
                node : node,
                value : node.name === 'array' ? [] : {}
            };
            
            var root_ = root;
            root = root.value[key];
            
            var cur_ = cur;
            cur = cur[key];
            
            this.after(function () {
                root = root_;
                cur = cur_;
            });
        }
        else {
            root.value[key] = {
                node : node,
                value : cur[key]
            };
        }
    });
    
    return root;
};
