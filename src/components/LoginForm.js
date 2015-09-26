var React = require('react');
var Utils = require('Utils');

var DataMixin = require('DataMixin');
var FormMixin = require('FormMixin');

var LoginForm = React.createClass({

    mixins: [FormMixin, DataMixin],

    render: function() {

        return (
            <div className="form-container">
                <label className="label label--block">
                    Username:
                </label>
                <input className="input input--block input--signout" type="text" id="identity" />
                <label className="label label--block">
                    Password:
                </label>
                <input className="input input--block input--signout" type="password" id="loginPassword" />
                <input className="button button--block" type="submit" 
                    onClick={this.handleSubmitClick} value="Sign in" />
            </div>
        );
    },

    handleSubmitClick: function(event) {
        // We won't be using React's `state` object here because some browsers
        // autopopulate login and registration forms, which messes with us
        // because they don't fire events that we can hook onto to update the
        // component state object.
        // 
        // TODO: Make IDs into data-attributes so we don't have to overqualify the
        // password ID
        
        var identity = $('#identity').val();
        var password = $('#loginPassword').val();

        if (!identity || !password) {
            Utils.Dispatcher.dispatch('error-message', { message: "Username and Password are required."});
        } else {
            var data = {
                "identity": identity,
                "password": password
            };
            this.loginUser(this.handleSuccess, this.handleError);
        }
    },

    handleSuccess: function(data, status, xhr) {
        console.log('SUCCESS: ',data, status, xhr);
        this.clearAllMessages();
        this.hideLoadingScreen();
        Utils.Dispatcher.dispatch('change-main-component', {page: "home"});
        Utils.Dispatcher.dispatch('user-state', { loggedIn: true });

        // if (data.data.user.role === 'admin') {
        //         Utils.Dispatcher.dispatch('new-item', {
        //         username: data.data.user.username,
        //         token: data.data.token,
        //         userid: data.data.user.userid
        //     });
        //     this.clearErrorMessage();
        //     Utils.Dispatcher.dispatch('change-main-component', {page: "home"});
        //     Utils.Dispatcher.dispatch('change-header-component', {loginState: "logged-in"});
        // } else {
        //     Utils.Dispatcher.dispatch('error-message', {message: "You must be an admin in order to log in. Please contact jessicachanstudios@gmail.com to get an admin account."});
        // }
    },

    handleError: function(data, status, xhr) {
        console.log('ERROR: ',data, status, xhr);
        this.hideLoadingScreen();
        Utils.Dispatcher.dispatch('error-message', {message: "Login failed. Please try again.  Server responded: " + data.responseJSON.msg});
    }
});

module.exports = LoginForm;