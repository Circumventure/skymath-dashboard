var React = require('react');

var InputRadio = React.createClass({
    render: function() {
        return (
            <fieldset className={this.props.className}>
                <label className={this.props.labelClass}>
                    {this.props.label}
                    <span className="sub-label">{this.props.sublabel}</span>
                </label>
                <div className="select-group">
                    {this.props.options.map(function(option) {
                        return(
                            <div className="input input--block">
                                <input type="radio" onChange={this.props.onChange} className={this.props.inputClass} value={option.value} name={this.props.id} checked={option.checked} />{option.label}
                            </div>
                        );
                    }, this)}
                </div>
            </fieldset>
        );
    }
});

module.exports = InputRadio;