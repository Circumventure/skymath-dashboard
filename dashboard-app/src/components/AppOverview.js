var React = require('react');
var Radium = require('radium');
var Style = Radium.Style;

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputSelect = require('InputSelect');
var AppDetail = require('AppDetail');

var AppOverview = React.createClass({
    mixins: [DataMixin],

    componentWillMount: function() {
        if (!Utils.Store.getStore('islandList')) {
            this.getIslandsWithDetails(this.islandDataSuccess, this.islandDataError);    
        } else {
            this.loadData(Utils.Store.getStore('islandList'));
        }
        
        Utils.Dispatcher.register('islandList-change', [], this.handleListChange);
        Utils.Dispatcher.register('change-island-overview', [], this.handleChangeView);
        Utils.Dispatcher.dispatch('change-header-name', {
            name: 'Apps:',
            subname: 'Edit Apps'
        });
    },

    componentWillUnmount: function() {
        Utils.Dispatcher.dispatch('change-header-name', {
            name: '',
            subname: ''
        });
    },

    getInitialState: function() {
        return {
            islandList: [],
            selectedIsland: null,
            selectedGrade: null,
            view: 'overview',
            selectedRecordData: {}
        };
    },

    render: function() {   

        switch(this.state.view) {
        case 'create':
            return (
                <AppDetail mode={this.state.view} refresh={this.refreshData} />
            );
        case 'edit':
            return (
                <AppDetail mode={this.state.view} data={this.state.selectedRecordData} refresh={this.refreshData} />
            );
        case 'overview':
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
                        <div className="app1_name tableCell">
                            {record.app1_name}
                        </div>
                        <div className="app2_name tableCell">
                            {record.app2_name}
                        </div>
                        <div className="app3_name tableCell">
                            {record.app3_name}
                        </div>
                        <div className="app4_name tableCell">
                            {record.app4_name}
                        </div>
                        <div className="islandOperations tableCell">
                            <input className="button button--block" type="button" value="Edit" data-islandname={record.island_name} id={'id-' + record.id} onClick={this.handleEditRecord} />
                            {/* <input className="button button--block" type="button" value="Delete" /> */}
                        </div>
                    </div>
                );
                return;
            }, this);

            return (
                <div className="island-detail IslandOverview">
                    <Style scopeSelector=".IslandOverview"
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
                    {/* <div className="operations">
                        <input className="button button--block" type="button" value="New" onClick={this.handleCreateNew} /> 
                    </div>*/}
                    <div className="line">
                        <div className="box size12of12">
                            <div className="islandRow header tableRow">
                                <div className="islandName tableCell">
                                    Island Name
                                </div>
                                <div className="app1_name tableCell">
                                    App1 Title
                                </div>
                                <div className="app2_name tableCell">
                                    App2 Title
                                </div>
                                <div className="app3_name tableCell">
                                    App3 Title
                                </div>
                                <div className="app4_name tableCell">
                                    App4 Title
                                </div>
                                <div className="islandOperations tableCell">
                                    Operations
                                </div>
                            </div>
                            {islandRows}
                        </div>
                    </div>
                </div>
            );
        default:
            return;
        }     
        
    },

    loadData: function(data) {
        this.setState({
            islandList: data
        });
    },

    refreshData: function() {
        this.getIslands(this.islandDataSuccess, this.islandDataError);
    },

    islandDataSuccess: function(data, xhr, status) {
        // console.log('SUCCESS>>>', data);
        Utils.Dispatcher.dispatch('new-item', { data: JSON.parse(data).data.islands, storeName: 'islandList' });
    },

    islandDataError: function(data, xhr, status) {
        // console.log('ERROR>>>', data);
        Utils.Dispatcher.dispatch('error-message', {
            message: 'There was an error getting island data. Server responded: ' + data.responseJSON.msg
        });
    },    

    handleListChange: function(data) {
        // console.log('LIST CHANGED>>>', data);
        this.loadData(data);
    },

    handleChangeView: function(data) {
        this.setState({
            view: data.view
        });
    },

    applyFilter: function(event) {
        var value = event.target.value;
        var key = event.target.id;
        var newState = {};
        newState[key] = value;
        this.setState(newState);
    },

    handleCreateNew: function() {
        this.setState({
            view: 'create'
        });
    },

    handleEditRecord: function(event) {
        var id = event.target.id.slice(3);
        var data;

        // TODO: There needs to be a better way than iterating through list each time.
        // Maybe store the record during the render map
        for (var i = 0; i < this.state.islandList.length; i++) {
            if (this.state.islandList[i].id == id) {
                data = this.state.islandList[i];
            }
        }
        for (var key in data) {
            if (data[key] instanceof Array)  {
                var arr = data[key];
                for (var i = 0; i < arr.length; i++) {
                    if (key.indexOf('app') !== -1) {
                        for (var key1 in arr[i]) {
                            data['app' + (i + 1) + '_' + key1] = arr[i][key1];
                        }
                        
                    }
                    if (key.indexOf('video') !== -1) {
                        for (var key2 in arr[i]) {
                            data['video' + (i + 1) + '_' + key2] = arr[i][key2];
                        }
                    }
                }
                delete data[key];
            }
        }

        console.log("DA DATAA: ", data);
        this.setState({
            view: 'edit',
            selectedRecordData: data
        });
    },

    compnoentDidMount: function() {
        if (this.props && this.props.view) {
            this.setState({
                view: this.props.view
            });
        }
    }

});

module.exports = Radium(AppOverview);