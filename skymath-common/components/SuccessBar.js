var React = require('react');

var Utils = require('Utils');

var SuccessBar = React.createClass({
    componentWillMount: function() {
        Utils.Dispatcher.register('success-message', [], this.handleIncomingMessage);
    },

    getInitialState: function() {
        return {
            message: null,
            hidden: "hidden"
        };
    },

    render: function() {

        $('html,body').scrollTop(0);

        return(
            <div className={this.state.hidden + " success"} id="SuccessBar">
                {this.state.message}
            </div>
        );
    },

    handleIncomingMessage: function(data) {
        this.setState({
            message: data.message,
            hidden: data.message ? "" : "hidden"
        });
    }
});

module.exports = SuccessBar;