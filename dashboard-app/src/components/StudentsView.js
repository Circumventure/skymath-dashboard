var React = require('react');
var Radium = require('radium');
var Style = Radium.Style;

var FormMixin = require('FormMixin');
var InputSelect = require('InputSelect');
var Utils = require('Utils');

var UserSearch = React.createClass({
    mixins: [FormMixin],

    kidFields: [
        'screenname',
        'grade',
        'activeIsland',
        'completedIslands',
        'curriculum',
        'grade',
        // 'islands',
        'city',
        'state',
        'zipcode'
        // skills learned?
        // starting level island name?
        // starting island?
        // starting level grade equivalency ?
    ],

    componentWillMount: function() {
        Utils.Dispatcher.dispatch('change-header-title', {
            title: 'Students:',
            subtitle: 'View Student Information'
        });
        Utils.Dispatcher.dispatch('change-menu-highlight', {
            current: 'user-search'
        });
        Utils.Dispatcher.register('studentData-change', [], this.handleReceiveData);
    },

    componentWillUnmount: function() {
        // Restore app width
        var container = document.querySelector('.admin-app > .line > div');
        $(container).addClass('size9of12').removeClass('size12of12');
    },

    getInitialState: function() {
        var filters = {};

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

        var studentFilter = Utils.Store.getStore('studentFilters');
        for (var key in studentFilter) {
            filters[key] = optionsFactory(studentFilter[key]);

            // Because the integrity of the data is bad except for grades, we need
            // to allow for a blank value as a filter.
            if (key !== "grades") {
                filters[key].unshift({
                    label: '-- Blank Value --',
                    value: ''
                });
            }

            filters[key].unshift({
                label: '-- Select one --',
                value: null
            });
        }

        return {
            filters: filters,
            data: []
        };

    },

    render: function() {

        var kidData = [];
        if (this.state.data[this.state.currIndex]) {
            kidData = this.state.data[this.state.currIndex].kids;
        }

        var kidHeaderCells = [];
        this.kidFields.map(function(field) {
            kidHeaderCells.push(
                <div className={field + ' tableCell'}>
                    {field}
                </div>
            );
        });

        var kidHeader = [
            <div className="islandRow header tableRow">
                {kidHeaderCells}
            </div>
        ];

        var kidRows = [];
        var data = this.state.data;

        for (var i = 0; i < data.length; i++) {
            var currData = data[i];
            var cells = [];

            var curriculumData = JSON.parse(currData['curriculum']) || [];

            // format curriculum more nicely
            output = [];
            for (var j = 0; j < curriculumData.length; j++) {
                output.push(
                    <li>
                        {curriculumData[j].name}
                    </li>
                );
            }
            currData['curriculum'] = output;

            // Active island is index of curriculum
            var activeIsland = currData['activeIsland'];

            // Completed islands is active island
            currData['completedIslands'] = activeIsland && parseInt(activeIsland, 10)

            currData['activeIsland'] = curriculumData[activeIsland] && curriculumData[activeIsland].name

            this.kidFields.map(function(field) {
                cells.push(<div className={field + ' tableCell'}>
                    {currData[field]}
                </div>);
            });
            kidRows.push(<div className="islandRow tableRow">{cells}</div>);
        }

        return (
            <div className="students-view StudentsView">
                <Style rules={{
                    '#MainComponent': {
                        overflow: 'scroll'
                    },
                    '.UserSearch .header': {
                        fontSize: '0.85em !important'
                    }
                }} />
                <Style scopeSelector=".StudentsView"
                    rules={{
                        'a': {
                            color: '#AC660E',
                            fontSize: '.7em',
                            textTransform: 'uppercase',
                            fontWeight: '700',
                            cursor: 'pointer'
                        },
                        '.tableRow': {
                            display: 'table-row'
                        },
                        '.tableCell': {
                            display: 'table-cell',
                            verticalAlign: 'top'
                        },
                        '.filterContainers': {
                            width: '50%',
                            paddingBottom: '40px'
                        },
                        '.header': {
                            fontWeight: '700',
                            fontSize: '1.15em'
                        },
                        label: {
                            fontSize: '1.3em',
                            lineHeight: '2em'
                        },
                        '.islandRow .tableCell': {
                            padding: '7px',
                            borderBottom: '1px solid white'
                        }
                    }} />
                <div className="line">
                    <div className="box col size10of12">
                        <div className="box col size3of12">
                            <InputSelect label="Grade:" id="grade" className="fieldset" options={this.state.filters['grades']} />
                        </div>
                        <div className="box col size3of12">
                            <InputSelect label="City:" id="city" className="fieldset" options={this.state.filters['cities']} />
                        </div>
                        <div className="box col size3of12">
                            <InputSelect label="State:" id="state" className="fieldset" options={this.state.filters['states']} />
                        </div>
                        <div className="box col size3of12">
                            <InputSelect label="Zipcode:" id="zipcode" className="fieldset" options={this.state.filters['zipcodes']} />
                        </div>
                    </div>
                    <div className="box col size1of12">
                        <button className="button button--inline-right" onClick={this.submitForm}>Go</button>
                    </div>
                </div>
                <div className="line">
                    <div className="box size12of12">
                        {kidHeader}
                        {kidRows}
                    </div>
                </div>
            </div>
        );
    },

    submitForm: function() {
        this.clearAllMessages();
        var grade = $('#grade').val();
        var city = $('#city').val();
        var state = $('#state').val();
        var zipcode = $('#zipcode').val();
        var data = {};

        if (grade !== '-- Select one --') {
            data['grade'] = grade;
        }

        if (city !== '-- Select one --') {
            data['city'] = city;
        }

        if (state !== '-- Select one --') {
            data['state'] = state;
        }

        if (zipcode !== '-- Select one --') {
            data['zipcode'] = zipcode;
        }

        Utils.Store.makeCall('getStudents', data);
    },

    handleReceiveData: function(data) {
        this.setState({
            data: data
        });
    }

});

module.exports = UserSearch;