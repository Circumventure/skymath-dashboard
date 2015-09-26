var React = require('react');

var InputText = require('InputText');

var PromptModal = React.createClass({
    render: function() {
        return(
            <div className="alert alert--prompt" id="PromptModal">
                <p>{this.props.message}</p>
                <InputText inputClass="input input--addedit" labelClass="label label--fixedwidth" className="fieldset" value={this.props.value} onChange={this.onChange} />
                <p className="button button--inline-right" onClick={this.handleConfirm}>{this.props.confirmMsg}</p>
                <p className="button secondary button--inline-right" onClick={this.handleCancel}>{this.props.cancelMsg}</p>
            </div>
        );
    },
    handleConfirm: function() {
        this.props.handleConfirm(this.props.data, this.props.value);
    },
    handleCancel: function() {
        this.props.handleCancel(this.props.data, this.props.value);
    },

    onChange: function(event) {
        var newValue = event.target.value;
        this.setProps({ value: newValue });
    }
});

module.exports = PromptModal;