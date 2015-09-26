var MicroEvent = require('microevent');
var Dispatcher = require('Dispatcher');

module.exports = {};
module.exports.Store = {
    state: {},

    add: function(newProps) {
        for (key in newProps) {
           this.state[key] = newProps[key];
        }
        return this.state;  
    },

    remove: function(key) {
        if (this.state[key]) {
            delete this.state[key];
            return this.state;
        }
        return false;
    },

    get: function() {
        return this.state;
    }
};

module.exports.Dispatcher = new Dispatcher();

MicroEvent.mixin(module.exports.Store);

/**
 * Ways to update the store
 */

module.exports.Dispatcher.register('new-item', [], function(data) {
    module.exports.Store.add(data);
    module.exports.Store.trigger('change');
});

module.exports.Dispatcher.register('remove-item', [], function(data) {
    if (module.exports.Store.remove(data)) {
        module.exports.Store.trigger('change');    
    }
});