var React = require('react');

var AlertModal = React.createClass({
    render: function() {
        return(
            <div className="alert" id="AlertModal">
                <p>{this.props.message}</p>
                <p className="button button--inline-right" onClick={this.handleConfirm}>{this.props.confirmMsg}</p>
                <p className="button secondary button--inline-right" onClick={this.handleCancel}>{this.props.cancelMsg}</p>
            </div>
        );
    },
    handleConfirm: function() {
        this.props.handleConfirm(this.props.data);
    },
    handleCancel: function() {
        this.props.handleCancel(this.props.data);
    }
});

module.exports = AlertModal;