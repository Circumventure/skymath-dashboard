var React = require('react');

var LoadingScreen = React.createClass({

    render: function() {
        return(
            <div className="loading-screen--bg">
                <div className="loading-screen--img">
                </div>
            </div>
        );
    }

});

module.exports = LoadingScreen;