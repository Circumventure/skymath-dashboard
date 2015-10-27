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
            'video1_notes': '',
            'video2_title': '',
            'video2_link': '',
            'video2_notes': '',
            'video3_title': '',
            'video3_link': '',
            'video3_notes': '',
            'video4_title': '',
            'video4_link': '',
            'video4_notes': '',
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
        this.props.refresh();
        Utils.Dispatcher.dispatch('change-island-overview', { view: 'overview' });
    },

    handleChange: function(event) {
        var newValue = {};
        newValue[event.target.id] = event.target.value;
        this.setState(newValue);
    },

    handleSave: function() {
        var data = {
            'island_name': this.state.island_name,
            'clean_name': this.state.clean_name,
            'parent_friendly_descriptions': this.state.parent_friendly_descriptions,
            'standards': this.state.standards,
            'domain': this.state.domain,
            'grade': this.state.grade,
            'curator_initials': this.state.curator_initials,
            'announce_sound': this.state.announce_sound,
            'videos' : [
                {
                    'title': this.state.video1_title,
                    'link': this.state.video1_link,
                    'notes': this.state.video1_notes
                },
                {
                    'title': this.state.video2_title,
                    'link': this.state.video2_link,
                    'notes': this.state.video2_notes
                },
                {
                    'title': this.state.video3_title,
                    'link': this.state.video3_link,
                    'notes': this.state.video3_notes
                },
                {
                    'title': this.state.video4_title,
                    'link': this.state.video4_link,
                    'notes': this.state.video4_notes
                }
            ],
            'total_cost_of_3_apps': this.state.total_cost_of_3_apps,
            'total_cost_of_4_apps': this.state.total_cost_of_4_apps,
            'apps': [
                {
                    'name': this.state.app1_name,
                    'icon': this.state.app1_icon,
                    'price': this.state.app1_price,
                    'video': this.state.app1_video,
                    'notes': this.state.app1_notes,
                    'link': this.state.app1_link
                },
                {
                    'name': this.state.app2_name,
                    'icon': this.state.app2_icon,
                    'price': this.state.app2_price,
                    'video': this.state.app2_video,
                    'notes': this.state.app2_notes,
                    'link': this.state.app2_link
                },
                {
                    'name': this.state.app3_name,
                    'icon': this.state.app3_icon,
                    'price': this.state.app3_price,
                    'video': this.state.app3_video,
                    'notes': this.state.app3_notes,
                    'link': this.state.app3_link
                },
                {
                    'name': this.state.app4_name,
                    'icon': this.state.app4_icon,
                    'price': this.state.app4_price,
                    'video': this.state.app4_video,
                    'notes': this.state.app4_notes,
                    'link': this.state.app4_link
                }
            ]
        };

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

module.exports = IslandDetail;