var burrito = require('burrito');

module.exports = function (src) {
    var self = {};
    var obj = JSON.parse(src);
    
    var cursor = [ obj ];
    var root = [ Array.isArray(obj) ? [] : {} ];
    
    var path = [];
    var prevPathLen = 0;
    
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
            return; // the root
        }
        else return;
        
        //console.log(path.concat(key).join('/'));
        
        if (node.name === 'object' || node.name === 'array') {
            prevPathLen = this.path.length;
            path.push(key);
            
            root[0][key] = {
                node : node.name,
                value : node.name === 'array' ? [] : {}
            };
            root.unshift(root[0][key].value);
            cursor.unshift(cursor[0][key]);
        }
        else {
            root[0][key] = { node : node.name, value : cursor[0][key] };
        }
    });
    
    root = root[root.length - 1];
    console.log(JSON.stringify(root, null, 2));
    
    self.set = function (key, value) {
    };
    
    self.toString = self.stringify = function () {
    };
    
    self.inspect = function () {
        return 'lul'
    };
    
    return self;
};
