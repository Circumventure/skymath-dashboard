var React = require('react');
var Radium = require('radium');
var Style = Radium.Style;

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputSelect = require('InputSelect');

var IslandDetail = React.createClass({
    mixins: [DataMixin],

    componentWillMount: function() {
        if (!Utils.Store.getStore('islandList')) {
            this.getIslands(this.islandDataSuccess, this.islandDataError);    
        } else {
            this.loadData(Utils.Store.getStore('islandList'));
        }
        
        Utils.Dispatcher.register('islandList-change', [], this.handleListChange);
        Utils.Dispatcher.dispatch('change-header-title', {
            title: 'Islands:',
            subtitle: 'Edit or add Islands'
        });
    },

    componentWillUnmount: function() {
        Utils.Dispatcher.dispatch('change-header-title', {
            title: '',
            subtitle: ''
        });
    },

    getInitialState: function() {
        return {
            islandList: [],
            selectedIsland: null,
            selectedGrade: null
        };
    },

    render: function() {        
        var repeatCheck = [];

        var grades = [{
            value: '',
            label: 'All'
        }];
        this.state.islandList.forEach(function(record) {
            if (repeatCheck.indexOf(record.grade_level) === -1) {
                repeatCheck.push(record.grade_level);
                grades.push({
                    value: record.grade_level,
                    label: record.grade_level
                });
            }
        });

        var islands = [{
            value: '',
            label: 'All'
        }];
        this.state.islandList.forEach(function(record) {
            if (repeatCheck.indexOf(record.island_name) === -1) {
                repeatCheck.push(record.island_name);
                islands.push({
                    value: record.island_name,
                    label: record.island_name
                });
            }
        });

        var islandRows = [];
        this.state.islandList.forEach(function(record) {
            var islandFilter = this.state.selectedIsland;
            var gradeFilter = this.state.selectedGrade;
            
            if ((islandFilter && record.island_name !== islandFilter) || (gradeFilter && record.grade_level !== gradeFilter)) {
                return;
            }


            islandRows.push(
                <div className="islandRow tableRow">
                    <div className="islandName tableCell">
                        {record.island_name}
                    </div>
                    <div className="islandDomain tableCell">
                        {record.domain}
                    </div>
                    <div className="islandGradeLevel tableCell">
                        {record.grade_level}
                    </div>
                    <div className="islandStandards tableCell">
                        {record.standards}
                    </div>
                    <div className="islandDescription tableCell">
                        {record.parent_friendly_descriptions}
                    </div>
                </div>
            );
            return;
        }, this);

        return (
            <div className="island-detail IslandDetail">
                <Style scopeSelector=".IslandDetail"
                    rules={{
                        '.tableRow': {
                            display: 'table-row'
                        },
                        '.tableCell': {
                            display: 'table-cell'
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
                            fontSize: '1.3em'
                        },
                        '.islandRow .tableCell': {
                            padding: '7px',
                            borderBottom: '1px solid white'
                        }
                    }}
                />
                <div className="filters tableRow">
                    <div className="select-grade tableCell filterContainers">
                        <InputSelect label="Select Grade:" options={grades} id="selectedGrade" onChange={this.applyFilter} />
                    </div>
                    <div className="select-island tableCell filterContainers">
                        <InputSelect label="Select Island:" options={islands} id="selectedIsland" onChange={this.applyFilter} />
                    </div>
                </div>
                <div className="line">
                    <div className="box size12of12">
                        <div className="islandRow header tableRow">
                            <div className="islandName tableCell">
                                Island Name
                            </div>
                            <div className="islandDomain tableCell">
                                Domain
                            </div>
                            <div className="islandGradeLevel tableCell">
                                Grade Level
                            </div>
                            <div className="islandStandards tableCell">
                                Standards
                            </div>
                            <div className="islandDescription tableCell">
                                Parent-friendly Description
                            </div>
                        </div>
                        {islandRows}
                    </div>
                </div>
            </div>
        );
    },

    loadData: function(data) {
        this.setState({
            islandList: data
        });
    },

    islandDataSuccess: function(data, xhr, status) {
        // console.log('SUCCESS>>>', data);
        Utils.Dispatcher.dispatch('new-item', { data: JSON.parse(data).data.islands, storeName: 'islandList' });
    },

    islandDataError: function(data, xhr, status) {
        // console.log('ERROR>>>', data);
        Utils.Dispatcher.dispatch('error-message', {
            message: 'There was an error getting island data. Server responded: ' + data.data.msg
        });
    },    

    handleListChange: function(data) {
        // console.log('LIST CHANGED>>>', data);
        this.loadData(data);
    },

    applyFilter: function(event) {
        var value = event.target.value;
        var key = event.target.id;
        var newState = {};
        newState[key] = value;
        this.setState(newState);
    }

});

module.exports = Radium(IslandDetail);