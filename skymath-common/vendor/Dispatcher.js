"use strict";

/**
 * Represents the relevant data of a listener
 * 
 * @param {integer} id
 * @param {Array.<integer>} 
 * @param {Function} fn 
 */
function Listener(id, dependencies, fn) {
  this.id = id;
  this.dependencies = dependencies;
  this.fn = fn;
}

"use strict";

/**
 * Controlls the successful disptching of a payload
 *
 * @constructor
 * @param {Array.<Object>} listeners Store listeners, their dependencies and ids
 * @param {*} payload The payload to be delivered to the listeners
 * @param {function} onComplete Callback after the payload has been delivered
 */
function Cycle(listeners, payload, onComplete) {
  // Copy references to listeners
  this._listenersToBeInvoked = listeners.slice();

  this._payload = payload;
  this._onComplete = onComplete;

  // Listeners their dependencies already resolved
  this._resolved = [];
  this._totalListenerCount = listeners.length;

  this._resolve();
}

Cycle.prototype = {

  /**
   * Iterates over all listeners and invokes every listener whose dependencies
   * already resolved.
   */
  _resolve: function() {
    this._resolvedInCurrentRun = false;

    // Mark as running.
    this._isResolving = true;

    // Invoke all listeners which dependencies already resolved
    for(var key in this._listenersToBeInvoked) {
      var listener = this._listenersToBeInvoked[key];

      if(this._didDependenciesResolve(listener.dependencies)) {
        var next = this._generateNext(listener.id);
        listener.fn(this._payload, next);

        delete this._listenersToBeInvoked[key];
      }
    }

    // Remove mark.
    this._isResolving = false;

    // If there are dependencies which resolved while this method was running
    if(this._resolvedInCurrentRun) {
      this._resolve();
    }

    // If all listeners are resolved, invoke callback
    if(this._resolved.length === this._totalListenerCount) {
      this._onComplete();
    }
  },

  /**
   * Generates a callback functions for listeners. Invoking the generated function
   * will mark the listener as resolved. If _resolve is currently running, a mark
   * is set. Else if _resolve is not running, it is invoked.
   *
   * @param  {string} key The listener's identifier
   * @return {function} Callback function for listeners, signaling that the listener has completed
   */
  _generateNext: function(key) {
    return function() {
      this._resolved.push(key);

      if(!this._isResolving) {
        this._resolve();
      }
      else {
        this._resolvedInCurrentRun = true;
      }
    }.bind(this);
  },

  /**
   * Checks whether all listeners in the given array already resolved
   *
   * @param  {Array.<Object>} dependencies Array of listeners
   * @return {boolean}
   */
  _didDependenciesResolve: function(dependencies) {
    // Checks whether every dependency is contained in this._resolved
    return dependencies.every(function(dependency) {
      return this._resolved.indexOf(dependency) !== -1;
    }.bind(this));
  }
};

/**
 * The dispatcher
 *
 * @constructor
 */
function Dispatcher() {
  this._actions = {};
  this._idCounter = 0;
}

Dispatcher.prototype = {

  /**
   * Registers listeners to actions with their dependencies
   * It's also possible to use the following notation to register a listener:
   * {
   *  action: 'exampleaction',
   *  dependencies: [dependency1, dependecy2],
   *  fn: myCallbackFunction
   * }
   *
   * @param  {string} action
   * @param  {Array.<integer>} dependencies
   * @param  {Function} fn The listener function
   * @return {integer} Token to be used as dependency for other listeners
   */
  register: function(action, dependencies, fn) {
    if(arguments.length === 1) {
      action = arguments[0].action;
      dependencies = arguments[0].dependencies;
      fn = arguments[0].fn;
    }

    if(!this._actions.hasOwnProperty(action)) {
      this._actions[action] = [];
    }

    var id = this._generateId();

    this._actions[action].push(new Listener(id, dependencies, fn));

    return id;
  },

  unregister: function(action, id) {
    if (this._actions[action]) {
      for (var i = 0; i < this._actions[action].length; i++) {
        if (this._actions[action][i].id === id) {
          this._actions[action].splice(i, 1);
        }
      }
    }
  },

  /**
   * Generates unique ids for listeners
   *
   * @return {integer}
   */
  _generateId: function() {
    return this._idCounter++;
  },

  /**
   * Dispatches a given action with the given payload
   *
   * @param  {string} actionName
   * @param  {*} payload
   * @param  {function=} onComplete
   */
  dispatch: function(actionName, payload, onComplete) {
    var callback = function() {
      if(onComplete) {
        onComplete();
      }
    };

    if(!this._actions[actionName]) {
      callback();
      return;
    }

    new Cycle(this._actions[actionName], payload, callback);
  }
};

module.exports = Dispatcher;