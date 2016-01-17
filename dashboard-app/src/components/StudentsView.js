var React = require('react');

var FormMixin = require('FormMixin');
var InputSelect = require('InputSelect');
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
        var optionsFactory = function(opts) {
            var out = [];
            opts.map(function(option) {
                out.push({
                    label: option,
                    value: option
                });
            });
            return out;
        };

        // Maybe try and get this information from the backend instead of hardcoding it 
        // a lot of times
        
        var gradeOpts = optionsFactory([
            'K', '1', '2', '3', '4', '5'
        ]);

        var islandsCompletedOpts = [];
        for (var i = 0; i <= 40; i++) {
            islandsCompletedOpts.push(i + '');
        }

        islandsCompletedOpts = optionsFactory(islandsCompletedOpts);

        var locationOpts = optionsFactory([
            'location1', 'location2'
        ]);

        var schoolOpts = optionsFactory([
            'school1', 'school2'
        ]);

        return (
            <div className="students-view StudentsView">
                <div className="line">
                    <div className="box col size10of12">
                        <div className="box col size3of12">
                            <InputSelect label="Grade Level:" className="fieldset" options={gradeOpts} />
                        </div>
                        <div className="box col size3of12">
                            <InputSelect label="# Islands Competed:" className="fieldset" options={islandsCompletedOpts} />
                        </div>
                        <div className="box col size3of12">
                            <InputSelect label="Location:" className="fieldset" options={locationOpts} />
                        </div>
                        <div className="box col size3of12">
                            <InputSelect label="School:" className="fieldset" options={schoolOpts} />
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