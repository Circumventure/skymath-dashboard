var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputText = require('InputText');

var VideoDetail = React.createClass({
    mixins: [DataMixin],

    getInitialState: function() {
        return {
            'island_name': '',
            'video1_title': '',
            'video1_link': '',
            'video1_notes': '',
            'video2_title': '',
            'video2_link': '',
            'video2_notes': '',
            'video3_title': '',
            'video3_link': '',
            'video3_notes': '',
            'video4_title': '',
            'video4_link': '',
            'video4_notes': ''
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
        if (event && event.target.value === 'Cancel') {
            Utils.Dispatcher.dispatch('change-island-overview', { view: 'overview' });
        } else {
            this.props.refresh();
            Utils.Dispatcher.dispatch('change-island-overview', { view: 'overview' });
        }
        
    },

    handleChange: function(event) {
        var newValue = {};
        newValue[event.target.id] = event.target.value;
        this.setState(newValue);
    },

    handleSave: function() {

        var data = this.state;

        if (this.props.mode === 'create') {
            this.createIsland(data, this.saveSuccess, this.saveError);
        } else if (this.props.mode === 'edit') {
            this.updateIsland(data, this.saveSuccess, this.saveError);
        }
    },

    saveSuccess: function(data, xhr, status) {
        Utils.Dispatcher.dispatch('success-message', { message: "Saved successfully."});
        this.backToOverview();
    },

    saveError: function(data, xhr, status) {
        Utils.Dispatcher.dispatch('error-message', { message: "Error saving. Server responded: " + JSON.parse(data).data.msg});
    }
});

module.exports = VideoDetail;