var React = require('react');

var FormMixin = require('FormMixin');
var InputText = require('InputText');
var Utils = require('Utils');

var UserSearch = React.createClass({
    mixins: [FormMixin],

    componentWillMount: function() {
        Utils.Dispatcher.dispatch('change-header-title', {
            title: 'Families:',
            subtitle: 'Search Families By Email'
        });
        Utils.Dispatcher.dispatch('change-menu-highlight', {
            current: 'user-search'
        });
    },

    render: function() {
        return (
            <div className="user-search UserSearch">
                <div className="line">
                    <div className="box size12of12">
                        <InputText label="Family Email Address:" className="fieldset familyEmail" id="familyEmailAddress" />
                        <button className="button button--inline-right">Go</button>
                    </div>
                </div>
                <div className="line">
                    <div className="display-inline-block family-info" style={{ marginRight: '20px' }}>
                        <h2 className="h2">Family Name</h2>
                        <p className="h3">CHAN</p>
                    </div>
                    <div className="display-inline-block family-info">
                        <h2 className="h2">PIN Number</h2>
                        <p className="h3">9999</p>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = UserSearch;