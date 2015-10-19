var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputText = require('InputText');

var IslandDetail = React.createClass({
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
            'announce_sound': '',
            'video1_title': '',
            'video1_link': '',
            'video_notes': '',
            'video2_title': '',
            'video2_link': '',
            'video2_notes': '',
            'video3_title': '',
            'video3_notes': '',
            'video4_title': '',
            'video4_link': '',
            'video4_notes': '',
            'total_cost_of_3_apps': '',
            'total_cost_of_4_apps': '',
            'app1_name': '',
            'app1_icon_url': '',
            'app1_link': '',
            'app2_price': '',
            'app2_notes': '',
            'app2_video': '',
            'app3_name': '',
            'app3_icon_url': '',
            'app3_link': '',
            'app3_price': '',
            'app3_notes': '',
            'app3_video': '',
            'app4_name': '',
            'app4_icon_url': '',
            'app4_link': '',
            'app4_price': '',
            'app4_notes': '',
            'app4_video': ''
        };
    },

    componentWillMount: function() {
        if (this.props && this.props.data) {
            this.setState(this.props.data);
        }
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

    backToOverview: function() {
        Utils.Dispatcher.dispatch('change-island-overview', { view: 'overview' });
    },

    handleChange: function(event) {
        var newValue = {};
        newValue[event.target.id] = event.target.value;
        this.setState(newValue);
    },

    handleSave: function() {
        if (this.props.mode === 'create') {
            this.createIsland(this.state, this.saveSuccess, this.saveError);
        } else if (this.props.mode === 'edit') {
            this.editIsland(this.state, this.saveSuccess, this.saveError);
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

module.exports = IslandDetail;