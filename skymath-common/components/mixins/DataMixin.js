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
        headers = args.headers ? args.headers : {};
        // Make this encoded version of password or something?
        headers['authorization'] = "Basic U2t5TWF0aDpTa3kkJCQxMjMhQE1hdGg=";
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
            headers: headers
        });
    },

    loginUser: function(data, successFn, errorFn) {
        this.ajaxCall({
            method: 'POST',
            data: {
                request: 'admin_login'
            },
            successFn: successFn,
            errorFn: errorFn,
            headers: {
                'AdminAuthorization': btoa(data['identity'] + ':' + data['password'])
            }
        });
    },

    registerUser: function() {},

    getIslandDataForSkillName: function(successFn, errorFn, skillName) {
        this.ajaxCall({
            method: 'POST',
            data: {
                request: 'get_island_data',
                skill_name: skillName
            },
            successFn: successFn,
            errorFn: errorFn
        })
    },

    getIslandsWithDetails: function(successFn, errorFn) {
        this.ajaxCall({
            method: 'POST',
            data: {
                request: 'get_islands'
            },
            successFn: successFn,
            errorFn: errorFn
        });
    },

    getStatistics: function(successFn, errorFn) {
        this.ajaxCall({
            method: 'POST',
            data: {
                request: 'get_statistics'
            },
            successFn: successFn,
            errorFn: errorFn
        });
    },

    createIsland: function(successFn, errorFn, data) {
        data['request'] = 'new_island';
        this.ajaxCall({
            method: 'POST',
            data: data,
            successFn: successFn,
            errorFn: errorFn
        });
    },

    updateIsland: function(successFn, errorFn, data) {
        data['request'] = 'update_island'
        this.ajaxCall({
            method: 'POST',
            data: data,
            successFn: successFn,
            errorFn: errorFn
        });
    },

    getTestQuestions: function(successFn, errorFn, data) {
        this.ajaxCall({
            method: 'POST',
            data: {
                request: 'fetch_all_island_at_grade_questions',
                grade: data && data['grade'],
                island: data && data['island']
            },
            successFn: successFn,
            errorFn: errorFn
        })
    },

    getAllTestQuestions: function(successFn, errorFn, data) {
        this.ajaxCall({
            method: 'POST',
            data: {
                request: 'fetch_all_island_questions',
                island_name: data && data['island_name']
            },
            successFn: successFn,
            errorFn: errorFn
        })
    },

    updateTestQuestion: function(successFn, errorFn, data) {
        data['request'] = 'update_question';
        this.ajaxCall({
            method: 'POST',
            data: data,
            successFn: successFn,
            errorFn: errorFn
        })
    }
};

module.exports = DataMixin;
