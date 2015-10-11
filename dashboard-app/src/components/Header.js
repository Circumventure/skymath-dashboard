var React = require('react');

var Menu = require('Menu');
var Utils = require('Utils');

var Header = React.createClass({

    componentDidMount: function() {
        Utils.Dispatcher.register('user-state', [], this.handleUserStateChange);
        Utils.Dispatcher.register('change-header-title', [], this.changeHeaderTitle);
    },

    getInitialState: function() {
        return {
            canGoHome: false,
            title: '',
            subtitle: ''
        };
    },

    render: function() {

        return (
            <div className="Header">
                <Menu />
                <div className="line">
                    <div className="box size9of12 margin-zero-auto">
                        <div className="header">
                            <div className="header-image">
                                <img src="build/img/header.png" className="header-image__img" onClick={this.handleGoHome} style={{cursor: this.state.canGoHome ? 'pointer' : 'default'}} />
                            </div>
                            <div className="header-title">
                                <h2 className="h2">{this.state.title}</h2>
                                <h3 className="h3">{this.state.subtitle}</h3>
                            </div>
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
    },

    changeHeaderTitle: function(data) {
        if (data.title || data.subtitle) {
            this.setState(data);
        }
    }
});

module.exports = Header;