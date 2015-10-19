var React = require('react');

var LoginForm = require('LoginForm');
var LoggedInHome = require('LoggedInHome');
var IslandOverview = require('IslandOverview');
var FormMixin = require('FormMixin');
var Utils = require('Utils');

var MainComponentContainer = React.createClass({
    mixins: [FormMixin],

    componentDidMount: function() {
        Utils.Dispatcher.register('change-main-component', [], this.handleEvent);
    },

    getInitialState: function() {
        return { page: 'signout' };
    },

    render: function() {
        var currentComponent = function() {
            switch(this.state && this.state.page) {
            case "home":
                return (
                    <LoggedInHome />
                );
                break;
            case "island-detail":
                return (
                    <IslandOverview view={this.state.data && this.state.data.view} />
                );
            case "signout":
                // Remove onbeforeunload handler when logged out
                window.onbeforeunload = null;
                return (
                    <div className="signin-form">
                        <h1 className="h1">Sign In</h1>
                        <LoginForm />
                    </div>
                );
                break;
            default:
                return (
                    <div>Error, unrecognized page destination.</div>
                );
            }
        }.bind(this);

        return (
            <div className="line app-min-height" id="MainComponent">
                <div className="box col-1 size10of12 padding-large">
                    {currentComponent()}
                </div>
            </div>
        );
    },

    handleEvent: function(data) {
        this.setState({
            page: data.page,
            data: data.data
        });
        this.clearAllMessages();
    }
});

module.exports = MainComponentContainer;