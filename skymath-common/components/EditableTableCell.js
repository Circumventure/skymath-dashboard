var React = require('react');
var Utils = require('Utils');

var EditableTableCell = React.createClass({
    getInitialState: function() {
        return {
            highlight: false,
            value: this.props.value
        };
    },

    render: function() {
        var style = {
            height: '170px'
        };

        if (this.state.activeEdit && this.props.editable) {
            var textareaStyle = {
                height: '70%',
                width: '100%',
                color: '#111',
                fontSize: '0.85em',
                lineHeight: '1.4em'
            };

            return (
                <div className={this.props.name + ' tableCell'} id={this.props.name} onMouseOver={this.handleHover} onMouseOut={this.handleMouseOut} style={style}>
                    <textarea value={this.state.value} onChange={this.onInputChange} style={textareaStyle} />
                    <a onClick={this.saveField}>Save</a> <a onClick={this.cancelSave}>Cancel</a>
                </div>
            );
        } else {
            var style = this.state.highlight && this.props.editable ? {
                backgroundColor: 'rgba(34, 188, 205, 0.97)',
                cursor: 'pointer'
            } : null;
            return (
                <div className={this.props.name + ' tableCell'} id={this.props.name} onClick={this.handleCellClick} onMouseOver={this.handleHover} onMouseOut={this.handleMouseOut} style={style}>
                    {this.props.value}
                </div>
            );
        }
    },

    onInputChange: function(event) {
        this.setState({
            value: event.target.value
        });
    },

    handleHover: function() {
        this.setState({
            highlight: true
        });
    },

    handleMouseOut: function() {
        this.setState({
            highlight: false
        });
    },

    handleCellClick: function(event) {
        this.setState({
            activeEdit: true
        });
    },

    saveField: function(event) {
        this.setState({
            activeEdit: false
        });

        var data = {
            question_id: this.props.recordId
        };
        data[this.props.name] = this.state.value;

        Utils.Store.makeCall('updateTestQuestion', data);
    },

    cancelSave: function() {
        this.setState({
            activeEdit: false
        });
    }
});

module.exports = EditableTableCell;
