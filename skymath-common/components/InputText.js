var React = require('react');

var InputText = React.createClass({
    render: function() {
        var subLabel = [];
        if (this.props.sublabel) {
            subLabel.push(
                <span className="sub-label">{this.props.sublabel}</span>
            );
        }
        return (
            <fieldset className={this.props.className}>
                <label className={this.props.labelClass}>
                    {this.props.label}
                    {subLabel}
                </label>
                <input onChange={this.props.onChange} className={this.props.inputClass} 
                    type="text" id={this.props.id} value={this.props.value} placeholder={this.props.placeholder} onBlur={this.props.onBlur} />
            </fieldset>
        );
    }
});

module.exports = InputText;