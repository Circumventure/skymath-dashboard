var React = require('react');
var Utils = require('Utils');

var FormMixin = {
    handleFormChange: function(event) {
        var newProp = {};
        newProp[event.target.id] = event.target.value;
        this.setState(newProp);
    },

    clearErrorMessage: function() {
        Utils.Dispatcher.dispatch('error-message', {message: null});
    },

    clearSuccessMessage: function() {
        Utils.Dispatcher.dispatch('success-message', {message: null});
    },

    clearAllMessages: function() {
        Utils.Dispatcher.dispatch('success-message', {message: null});
        Utils.Dispatcher.dispatch('error-message', {message: null});
    }
};

module.exports = FormMixin;