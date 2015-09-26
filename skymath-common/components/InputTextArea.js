var React = require('react');

var InputTextArea = React.createClass({
    render: function() {
        return (
            <fieldset className={this.props.className}>
                <label className={this.props.labelClass}>
                    {this.props.label}
                    <span className="sub-label">{this.props.sublabel}</span>
                </label>
                <textarea onChange={this.props.onChange} className={this.props.inputClass} 
                    id={this.props.id} value={this.props.value} onBlur={this.props.onBlur}  />
            </fieldset>
        );
    }
});

module.exports = InputTextArea;