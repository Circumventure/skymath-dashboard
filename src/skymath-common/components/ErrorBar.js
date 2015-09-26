var React = require('react');

var Utils = require('Utils');

var ErrorBar = React.createClass({
    componentWillMount: function() {
        Utils.Dispatcher.register('error-message', [], this.handleIncomingMessage);

        this.setState({
            message: null,
            hidden: "hidden"
        });
    },

    render: function() {

        $('html,body').scrollTop(0);

        return(
            <div className={this.state.hidden + " error"} id="ErrorBar">
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

module.exports = ErrorBar;