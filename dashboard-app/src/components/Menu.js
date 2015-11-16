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

        var adminSubmenuItemData = [
            {
                label: 'Test Questions',
                value: 'test-questions'
            },
            {
                label: 'Videos',
                value: 'videos'
            },
            {
                label: 'Apps',
                value: 'apps'
            },
            {
                label: 'Island Overview',
                value: 'island-overview'
            },

        ];

        var adminSubmenuItems = adminSubmenuItemData.map(function(data) {
            return (
                <li className="menu-subitem menu-item" onClick={this.handleMenuItemClick} id={data.value}>
                    <button className="menu-label">{data.label}</button>
                </li>
            );
        }.bind(this));

        return (
            <div className="line" style={{visibility: this.state.menuVisibility}}>
                <div className="box">
                    <ul className="top-menu">
                        <li className="menu-item">
                            <button className="menu-label">Menu</button>
                        </li>
                        <li className="menu-item">
                            <button className="menu-label">User Info</button>
                        </li>
                        <li className="menu-item" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                            <button className="menu-label">Admin</button>
                        </li>
                        <ul className={this.state.subMenuVisibility + " sub-menu"} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                            {adminSubmenuItems}
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
    },

    handleMenuItemClick: function(event) {
        var id = event.target.id || event.target.parentElement.id;
        Utils.Dispatcher.dispatch('change-main-component', {page: id});
    }
});

module.exports = Menu;
