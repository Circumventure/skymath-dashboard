var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputText = require('InputText');

var AppDetail = React.createClass({
    mixins: [DataMixin],

    getInitialState: function() {
        return {
            'island_name': '',
            'total_cost_of_3_apps': '',
            'total_cost_of_4_apps': '',
            'app1_name': '',
            'app1_icon': '',
            'app1_link': '',
            'app1_notes': '',
            'app1_price': '',
            'app1_video': '',
            'app2_name': '',
            'app2_icon': '',
            'app2_link': '',
            'app2_notes': '',
            'app2_price': '',
            'app2_video': '',
            'app3_name': '',
            'app3_icon': '',
            'app3_link': '',
            'app3_notes': '',
            'app3_price': '',
            'app3_video': '',
            'app4_name': '',
            'app4_icon': '',
            'app4_link': '',
            'app4_notes': '',
            'app4_price': '',
            'app4_video': '',
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
    },
});

module.exports = AppDetail;