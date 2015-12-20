var React = require('react');

var FormMixin = require('FormMixin');
var InputText = require('InputText');
var Utils = require('Utils');

var UserSearch = React.createClass({
    mixins: [FormMixin],

    componentWillMount: function() {
        Utils.Dispatcher.dispatch('change-header-title', {
            title: 'Students:',
            subtitle: 'View Student Information'
        });
        Utils.Dispatcher.dispatch('change-menu-highlight', {
            current: 'user-search'
        });
    },

    render: function() {
        return (
            <div className="students-view StudentsView">
                <div className="line">
                    <div className="box col size10of12">
                        <div className="box col size3of12">
                            <InputText label="Family Email Address:" className="fieldset" />
                        </div>
                        <div className="box col size3of12">
                            <InputText label="Family Email Address:" className="fieldset" />
                        </div>
                        <div className="box col size3of12">
                            <InputText label="Family Email Address:" className="fieldset" />
                        </div>
                        <div className="box col size3of12">
                            <InputText label="Family Email Address:" className="fieldset" />
                        </div>
                    </div>
                    <div className="box col size1of12">
                        <button className="button button--inline-right">Go</button>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = UserSearch;