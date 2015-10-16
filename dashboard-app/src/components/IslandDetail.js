var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputText = require('InputText');

var IslandDetail = React.createClass({
    mixins: [DataMixin],

    getInitialState: function() {
        return {
            data: {
                'domain': '',
                'curator_initials': '',
                'standards': '',
                'parent_friendly_descriptions': '',
                'clean_name': '',
                'announce_sound': '',
                'domain': '',
                'grade': '',
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
            }
        };
    },

    componentWillMount: function() {
        if (this.props && this.props.data) {
            this.setState(this.props.data);
        }
    },

    render: function() {

        var fields = Object.keys(this.state.data).map(function(field) {
            return (
                <InputText className="fieldset fieldset--addedit" labelClass="label" inputClass={field + ' input'} id={field} label={field} value={this.state[field]} onChange={this.handleChange} />
            );
        }, this);

        return (
            <div className="IslandDetail">
                <input className="button button--inline" type="button" value="Save" />
                <input className="button button--inline" type="button" value="Cancel" onClick={this.handleCancel} />
                {fields}
                <input className="button button--inline" type="button" value="Save" />
                <input className="button button--inline" type="button" value="Cancel" onClick={this.handleCancel} />
            </div>
        );
    },

    handleCancel: function() {
        Utils.Dispatcher.dispatch('change-main-component', { page: 'island-detail'});
    },

    handleChange: function(event) {
        var newValue = {};
        newValue[event.target.id] = event.target.value;
        this.setState(newValue);
    }
});

module.exports = IslandDetail;