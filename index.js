var burrito = require('burrito');

var jsup = module.exports = function (src) {
    var self = {};
    
    var obj = JSON.parse(src);
    var ann = jsup.annotate(src, obj);
    
    var lines = src.split('\n');
    function extract (node) {
        var s = lines.slice(node.start.line - 1, node.end.line).join('\n')
            .slice(node.start.col)
        ;
            
        if (node.end.col) {
            return s.slice(0, node.end.col - lines[node.end.line - 1].length + 1)
        }
        else return s;
    }
    
    self.set = function (key, value) {
    };
    
    self.stringify = self.toString = function () {
        var rows = [];
        
        (function walk (cursor) {
            var start = cursor.node.start;
            var end = cursor.node.end;
            console.log(extract(cursor.node));
            
            function setRow (coords, s) {
                if (!rows[coords.line]) rows[coords.line] = [];
                rows[coords.line][coords.col] = s;
            }
            
            if (Array.isArray(cursor.value)) {
                setRow(start, '[');
                cursor.value.forEach(walk);
                setRow(end, ']');
            }
            else if (typeof cursor.value === 'object') {
                setRow(start, '{');
                
                Object.keys(cursor.value).forEach(function (key, i) {
                    
                    var x = cursor.value[key].node;
                    setRow(x.start, JSON.stringify(key));
                    
                    walk(cursor.value[key]);
                });
                setRow(end, '}');
            }
            else {
                setRow(start, JSON.stringify(cursor.value));
            }
        })(ann);
        
        return rows.map(function (row) {
            return row.map(function (c) {
                if (typeof c === 'string') return c;
                else return ' ';
            }).join('');
        }).join('\n');
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
