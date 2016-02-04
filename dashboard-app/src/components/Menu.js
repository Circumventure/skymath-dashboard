var React = require('react');

var Utils = require('Utils');

var Menu = React.createClass({

    getInitialState: function() {
        return {
            adminSubmenuVisibility: 'hidden',
            userSearchSubmenuVisibility: 'hidden',
            menuVisibility: 'hidden',
            current: ''
        };
    },

    componentDidMount: function() {
        Utils.Dispatcher.register('user-state', [], this.handleUserStateChange);
        Utils.Dispatcher.register('change-menu-highlight', [], this.handleMenuChange);
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
            }
        ];

        var userSearchSubmenuItemData = [
            {
                label: 'Family By Email',
                value: 'user-search'
            },
            {
                label: 'Students',
                value: 'students'
            }

        ];

        var adminSubmenuItems = adminSubmenuItemData.map(function(data) {
            return (
                <li className="menu-subitem menu-item" onClick={this.handleMenuItemClick} id={data.value}>
                    <button className="menu-label">{data.label}</button>
                </li>
            );
        }.bind(this));

        var userSearchSubmenuItems = userSearchSubmenuItemData.map(function(data) {
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
                        <li className={'menu-item ' + (this.state.current === 'dashboard' ? 'active' : '')} onClick={this.handleMenuItemClick} id='home'>
                            <button className="menu-label">Dashboard</button>
                        </li>
                        <li className={'menu-item ' + (this.state.current === 'user-info' ? 'active' : '')} onClick={this.handleMenuClick} id='userSearchSubmenu'>
                            <button className="menu-label">User Info</button>
                        </li>
                        <li className={'menu-item ' + (this.state.current === 'admin' ? 'active' : '')} onClick={this.handleMenuClick} id="adminSubmenu">
                            <button className="menu-label">Admin</button>
                        </li>
                        <ul className={this.state.adminSubmenuVisibility + " sub-menu"}>
                            {adminSubmenuItems}
                        </ul>
                        <ul className={this.state.userSearchSubmenuVisibility + " sub-menu usersearch-submenu"} style={{ right: '222px' }}>
                            {userSearchSubmenuItems}
                        </ul>
                    </ul>
                </div>
            </div>
        );
    },

    handleGoHome: function() {
        Utils.Dispatcher.dispatch('change-main-component', {page: "home"});
    },

    handleMenuClick: function(event) {
        var newState = {};
        var targetId = event.target.id || event.target.parentElement.id;
        var key = targetId + 'Visibility';
        newState[key] = this.state[key] ? '' : 'hidden';
        this.setState(newState);
    },

    handleUserStateChange: function(data) {
        if (data.loggedIn) {
            this.setState({
                menuVisibility: 'visible'
            });
        }
    },

    handleMenuChange: function(data) {
        this.setState({
            current: data['current']
        });
    },

    handleMenuItemClick: function(event) {
        var id = event.target.id || event.target.parentElement.id;
        Utils.Dispatcher.dispatch('change-main-component', {page: id});
        // Hide all submenus
        var newState = {
            adminSubmenuVisibility: 'hidden',
            userSearchSubmenuVisibility: 'hidden'
        };
        this.setState(newState);
    }
});

module.exports = Menu;
