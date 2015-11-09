var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputText = require('InputText');

var Detail = React.createClass({
    mixins: [DataMixin],

    getInitialState: function() {
        return {
            'island_name': '',
            'clean_name': '',
            'parent_friendly_descriptions': '',
            'standards': '',
            'domain': '',
            'grade': '',
            'curator_initials': '',
            'announce_sound': ''
        };
    },

    componentWillMount: function() {
        var newState = {};
        if (this.props && this.props.data) {
            for (var key in this.props.data) {
                if (this.state[key] !== undefined) {
                    newState[key] = this.props.data[key];
                }
            }
        }
        this.setState(newState);
    },

    render: function() {

        var fields = Object.keys(this.state).map(function(field) {
            return (
                <InputText className="fieldset fieldset--addedit" labelClass="label" inputClass={field + ' input'} id={field} label={field} value={this.state[field]} onChange={this.handleChange} />
            );
        }, this);

        return (
            <div className="IslandDetail">
                <input className="button button--inline" type="button" value="Save" onClick={this.handleSave} />
                <input className="button button--inline" type="button" value="Cancel" onClick={this.backToOverview} />
                {fields}
                <input className="button button--inline" type="button" value="Save" onClick={this.handleSave} />
                <input className="button button--inline" type="button" value="Cancel" onClick={this.backToOverview} />
            </div>
        );
    },

    backToOverview: function(event) {
        Utils.Dispatcher.dispatch('change-island-overview', { view: 'overview' });

    },

    handleChange: function(event) {
        var newValue = {};
        newValue[event.target.id] = event.target.value;
        this.setState(newValue);
    },

    handleSave: function() {
        var data = this.state;
        Utils.Store.makeCall('updateIsland', data);
        this.backToOverview();
    }
});

module.exports = Detail;
