var React = require('react');

var Utils = require('Utils');
var LoadingScreen = require('LoadingScreen');

var DataMixin = {
    showLoadingScreen: function() {
        React.render(
            <LoadingScreen />,
            document.getElementById('loadingScreen')
        );
    },

    hideLoadingScreen: function() {
        React.unmountComponentAtNode(document.getElementById('loadingScreen'));
    },

    /**
     * All Ajax error callbacks should go through this handler first
     * TODO: Find any that don't
     * @param  {Function} errorFn 
     * @param  {Object} data    
     * @param  {$Object} xhr     
     */
    handleErrorFunc: function(errorFn, data, status, xhr) {
        this.hideLoadingScreen();

        if (data && data.responseJSON) {
            errorFn(data, status, xhr);
        } else if (data && data.responseText) {
            data.responseJSON = JSON.parse(data.responseText);
            errorFn(data, status, xhr);
        } else {
            Utils.Dispatcher.dispatch('error-message', {message: "An unexpected error has occurred. Please contact jessicachanstudios@gmail.com."});
        }
    },

    /**
     * All Ajax success callbacks should go through this handler first
     * TODO: Find any that don't
     * @param  {Function} errorFn 
     * @param  {Object} data    
     * @param  {$Object} xhr     
     */
    handleSuccessFunc: function(successFn, data, status, xhr) {
        this.hideLoadingScreen();
        successFn(data, status, xhr);
    },

    /**
     * Wrapper for JQuery Ajax method
     * @param  {Object} args Hash of keyed arguments (method, data, successFn, errorFn)
     * @return {[type]}      [description]
     */
    ajaxCall: function(args) {
        $.ajax({
            beforeSend: function(xhr, settings) {
                this.showLoadingScreen();
            }.bind(this),
            // TODO(jchan): All endpoints have the same URL for now, but Chuks will be
            // converting to REST practices and we will eventually need URLs to point to
            // specific endpoints.
            // 
            // When this happens, args.url should contain the route to the endpoint
            url: API_URL, // Eventually `url: API_URL + args.url`
            crossDomain: true,
            method: args.method,
            data: args.data,
            success: function(data, status, xhr) {
                this.handleSuccessFunc(args.successFn, data, status, xhr);
            }.bind(this),
            error: function(data, status, xhr) {
                this.handleErrorFunc(args.errorFn, data, status, xhr);
            }.bind(this),
            headers: {
                "x-access-token": Utils.Store.get().token,
                "x-key": Utils.Store.get().username    
            }
        });
    },

    loginUser: function(successFn, errorFn) {
        // TODO(jchan): No login endpoint yet
        // this.ajaxCall({
        //     method: 'POST',
        //     data: {
        //         request: 'login',
        //         userid: 'test',
        //         password: 'test',
        //     },
        //     successFn: successFn,
        //     errorFn: errorFn
        // });
        successFn();
    },

    registerUser: function() {},

    getRecordFromStore: function(id, listName) {
        var store = Utils.Store.state[listName];
        if (store && store.length) {
            for (var i = 0; i < store.length; i++) {
                if (id === store[i].id) {
                    return store[i];
                }
            }
        }
    }
};

module.exports = DataMixin;