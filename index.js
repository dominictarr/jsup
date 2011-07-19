var burrito = require('burrito');

module.exports = function (src) {
    var self = {};
    var nodes = [];
    
    burrito('[\n' + src + '\n][0]', function (node) {
        var p = node.parent();
        if (p && p.name === 'object') {
            var ix = this.path[ this.path.length - 2 ];
            var key = p.value[0][ix][0];
            console.log(key);
        }
        else if (p && p.name === 'array') {
        }
        
        nodes.push(node);
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
