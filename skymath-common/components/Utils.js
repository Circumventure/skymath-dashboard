var MicroEvent = require('microevent');
var Dispatcher = require('Dispatcher');

module.exports = {};
var storeInstance, dispatcherInstance, Store = function() {
    this._store = {};
    this._calls = {};

    this.addDataToStore = function(data, storeName) {
        if (!storeName) {
            throw Error('storeName is required')
        }

        var store = this._store[storeName];

        if (store === undefined) {
            this._store[storeName] = data;
            dispatcherInstance.dispatch(storeName + '-change',
                storeInstance.getStore(storeName));
            return this._store[storeName];
        }

        if ($.isArray(store)) {
            if ($.isArray(data)) {
                store = store.concat(data);
                dispatcherInstance.dispatch(storeName + '-change',
                    storeInstance.getStore(storeName));
                return store;
            } else {
                throw Error('cannot combine an Object and an Array type store');
            }
        }

        // Performs a deep copy merge of named store with the provided data.
        $.extend(true, store, data);
        dispatcherInstance.dispatch(storeName + '-change',
            storeInstance.getStore(storeName));
        return store;
    };

    this.updateDataById = function(data, storeName, id) {
        if (!this._store[storeName]) {
            throw Error(storeName + ' doesn\'t exist');
        }

        var store = this._store[storeName];

        for (var i = 0; i < store.length; i++) {
            if (store[i].id === id) {
                store[i] = data;
                dispatcherInstance.dispatch(storeName + '-change', storeInstance.getStore(storeName));
                return;
            }
        }

        throw Error(id + 'doesn\'t exist in ' + storeName);
    };

    this.removeStore = function(storeName) {
        if (this._store[storeName]) {
            delete this._store[storeName];
            return this._store;
        }
        return false;
    };

    this.getStore = function(storeName) {
        return this._store[storeName];
    };

    this.registerCall = function(name, call, success, error, makeCallNow, data) {
        this._calls[name] = {
            callFn: call,
            successFn: success,
            errorFn: error
        };

        if (makeCallNow) {
            call(success, error, data);
        }

    };

    this.makeCall = function(name, data) {
        var entry = this._calls[name];
        entry.callFn(entry.successFn, entry.errorFn, data);
    };
};

dispatcherInstance = module.exports.Dispatcher = new Dispatcher();
storeInstance = module.exports.Store = new Store();

MicroEvent.mixin(module.exports.Store);

/**
 * Ways to update the store
 */

dispatcherInstance.register('new-item', [], function(data) {
    storeInstance.addDataToStore(data.data, data.storeName);
    dispatcherInstance.dispatch(data.storeName + '-change', storeInstance.getStore(data.storeName));
});

dispatcherInstance.register('remove-store', [], function(data) {
    if (storeInstance.removeStore(data.storeName)) {
        storeInstance.trigger(data.storeName + '-remove');
      }
});
