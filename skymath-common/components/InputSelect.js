var React = require('react');

var InputSelect = React.createClass({
    render: function() {
        return (
            <fieldset className={this.props.className}>
                <label className={this.props.labelClass}>
                    {this.props.label}
                    <span className="sub-label">{this.props.sublabel}</span>
                </label>
                <select className={this.props.inputClass + ' select-group'} id={this.props.id} onChange={this.props.onChange} onBlur={this.props.onBlur}>
                    {this.props.options.map(function(option) {
                        if (option) {
                            if (option.value === this.props.defaultValue) {
                                return(
                                    <option value={option.value} key={option.value} disabled={option.disabled} >{option.label}</option>
                                );    
                            } else {
                                return(
                                    <option value={option.value} key={option.value} disabled={option.disabled} >{option.label}</option>
                                );
                            }
                        }
                    }, this)}
                </select>
            </fieldset>
        );
    }
});

module.exports = InputSelect;