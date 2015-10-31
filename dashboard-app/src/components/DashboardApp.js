var React = require('react');

var DataMixin = require('DataMixin');
var Header = require('Header');
var ErrorBar = require('ErrorBar');
var SuccessBar = require('SuccessBar');
var MainComponentContainer = require('MainComponentContainer');

var DashboardApp = React.createClass({

    render: function() {
        return(
            <div className="admin-app" id="adminApp">
                <Header />
                <div className="line">
                    <div className="margin-zero-auto box size9of12">
                        <div className="line">
                            <div id="messages">
                                <ErrorBar message="" />
                                <SuccessBar message="" />
                            </div>
                            <div id="main" className="main-container">
                                <MainComponentContainer />
                            </div>
                            <div id="alert" className="alert-container">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = DashboardApp;