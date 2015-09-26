var React = require('react');

var Menu = require('Menu');
var Utils = require('Utils');

var Header = React.createClass({

    componentDidMount: function() {
        Utils.Dispatcher.register('user-state', [], this.handleUserStateChange);
    },

    getInitialState: function() {
        return {
            canGoHome: false
        };
    },

    render: function() {

        return (
            <div className="Header">
                <Menu />
                <div className="line">
                    <div className="box size9of12 margin-zero-auto">
                       <div className="header">
                            <img src="build/img/header.png" className="header-image" onClick={this.handleGoHome} style={{cursor: this.state.canGoHome ? 'pointer' : 'default'}} />
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    handleGoHome: function() {
        if (this.state.canGoHome) {
            Utils.Dispatcher.dispatch('change-main-component', {page: "home"});    
        }
    },

    handleUserStateChange: function(data) {
        if (data.loggedIn) {
            this.setState({
                canGoHome: true
            });
        }
    }
});

module.exports = Header;