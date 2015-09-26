var React = require('react');

var Utils = require('Utils');

var Menu = React.createClass({

    getInitialState: function() {
        return {
            subMenuVisibility: 'hidden',
            menuVisibility: 'hidden'
        };
    },

    componentDidMount: function() {
        Utils.Dispatcher.register('user-state', [], this.handleUserStateChange);
    },

    render: function() {

        return (
            <div className="line" style={{visibility: this.state.menuVisibility}}>
                <div className="box">
                    <ul className="top-menu">
                        <li className="menu-item">
                            <p className="menu-label">Menu</p>
                        </li>
                        <li className="menu-item">
                            <p className="menu-label">User Info</p>
                        </li>
                        <li className="menu-item" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                            <p className="menu-label">Admin</p>
                        </li>
                        <ul className={this.state.subMenuVisibility + " sub-menu"} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                            <li className="menu-subitem menu-item">
                                <p className="menu-label">Test Questions</p>
                            </li>
                            <li className="menu-subitem menu-item">
                                <p className="menu-label">Videos</p>
                            </li>
                            <li className="menu-subitem menu-item">
                                <p className="menu-label">Apps</p>
                            </li>
                            <li className="menu-subitem menu-item">
                                <p className="menu-label">Island Detail</p>
                            </li>
                        </ul>
                    </ul>
                </div>
            </div>
        );
    },

    handleGoHome: function() {
        Utils.Dispatcher.dispatch('change-main-component', {page: "home"});
    },

    handleMouseOver: function() {
        this.setState({
            subMenuVisibility: ''
        })
    },

    handleMouseOut: function() {
        this.setState({
            subMenuVisibility: 'hidden'
        })
    },

    handleUserStateChange: function(data) {
        if (data.loggedIn) {
            this.setState({
                menuVisibility: 'visible'
            });
        }
    }
});

module.exports = Menu;