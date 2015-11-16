var React = require('react');
var Radium = require('radium');
var Style = Radium.Style;

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputSelect = require('InputSelect');
var IslandDetail = require('IslandDetail');

var IslandOverview = React.createClass({
    mixins: [DataMixin],

    recordMap: {},

    componentWillMount: function() {
        Utils.Dispatcher.register('change-testQuestion-overview', [], this.handleChangeView);
        Utils.Dispatcher.dispatch('change-header-title', {
            title: 'Test Questions:',
            subtitle: 'Edit Test Questions'
        });
    },

    componentWillUnmount: function() {
        // Restore app width
        var container = document.querySelector('.admin-app > .line > div');
        $(container).addClass('size9of12').removeClass('size12of12');

        Utils.Dispatcher.dispatch('change-header-title', {
            title: '',
            subtitle: ''
        });
    },

    getInitialState: function() {
        return {
            testQuestionList: [],
            selectedIsland: null,
            selectedGrade: null,
            view: 'overview',
            selectedRecordData: {}
        };
    },

    render: function() {

        switch(this.state.view) {
        // case 'create':
        //     return (
        //         <IslandDetail mode={this.state.view} refresh={this.refreshData} />
        //     );
        // case 'edit':
        //     return (
        //         <IslandDetail mode={this.state.view} data={this.state.selectedRecordData} refresh={this.refreshData} />
        //     );
        case 'overview':

            var islandRows = [];
            this.state.testQuestionList.forEach(function(record) {
                this.recordMap[record.id] = record;
                var islandFilter = this.state.selectedIsland;
                var gradeFilter = this.state.selectedGrade;

                if ((islandFilter && record.island !== islandFilter) || (gradeFilter && record.grade.toString() !== gradeFilter)) {
                    return;
                }


                islandRows.push(
                    <div className="islandRow tableRow">
                        <div className="island tableCell">
                            {record.island}
                        </div>
                        <div className="standard tableCell">
                            {record.standard}
                        </div>
                        <div className="source tableCell">
                            {record.source}
                        </div>
                        <div className="sourceId tableCell">
                            {record.source_id}
                        </div>
                        <div className="isChecked tableCell">
                            {record.is_checked}
                        </div>
                        <div className="diagnosticUse tableCell">
                            {record.diagnostic_use}
                        </div>
                        <div className="gatekeeperUse tableCell">
                            {record.gatekeeper_use}
                        </div>
                        <div className="questionText tableCell">
                            {record.question_text}
                        </div>
                        <div className="questionSpoken tableCell">
                            {record.question_spoken}
                        </div>
                        <div className="questionImage tableCell">
                            {record.question_image}
                        </div>
                        <div className="answer tableCell">
                            {record.answer}
                        </div>
                        <div className="choice1 tableCell">
                            {record.choice1}
                        </div>
                        <div className="choice1Id tableCell">
                            {record.choice1_id}
                        </div>
                        <div className="choice1Img tableCell">
                            {record.choice1_img}
                        </div>
                        <div className="choice1 tableCell">
                            {record.choice2}
                        </div>
                        <div className="choice1Id tableCell">
                            {record.choice2_id}
                        </div>
                        <div className="choice1Img tableCell">
                            {record.choice2_img}
                        </div>
                    </div>
                );
                return;
            }, this);

            // Expand the view of just this component
            var container = document.querySelector('.admin-app > .line > div');
            $(container).removeClass('size9of12').addClass('size12of12');

            return (
                <div className="island-detail TestQuestionOverview">
                    <Style rules={{
                        '#MainComponent': {
                            overflow: 'scroll'
                        },
                        '.TestQuestionOverview .header': {
                            fontSize: '0.85em !important'
                        }
                    }} />
                    <Style scopeSelector=".TestQuestionOverview"
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
                        <div className="select-island tableCell filterContainers">
                            <InputSelect label="Select Island:" options={Utils.Store.getStore('islandOptions')} id="selectedIsland" onChange={this.applyFilter} />
                        </div>
                        <div className="select-grade tableCell filterContainers">
                            <InputSelect label="Select Grade:" options={Utils.Store.getStore('gradeOptions')} id="selectedGrade" onChange={this.applyFilter} />
                        </div>
                    </div>
                    {/* <div className="operations">
                        <input className="button button--block" type="button" value="New" onClick={this.handleCreateNew} />
                    </div>*/}
                    <div className="line">
                        <div className="box size12of12">
                            <div className="islandRow header tableRow">
                                <div className="island tableCell">
                                    island
                                </div>
                                <div className="standard tableCell">
                                    standard
                                </div>
                                <div className="source tableCell">
                                    source
                                </div>
                                <div className="sourceId tableCell">
                                    source_id
                                </div>
                                <div className="isChecked tableCell">
                                    is_checked
                                </div>
                                <div className="diagnosticUse tableCell">
                                    diagnostic_use
                                </div>
                                <div className="gatekeeperUse tableCell">
                                    gatekeeper_use
                                </div>
                                <div className="questionText tableCell">
                                    question_text
                                </div>
                                <div className="questionSpoken tableCell">
                                    question_spoken
                                </div>
                                <div className="questionImage tableCell">
                                    question_image
                                </div>
                                <div className="answer tableCell">
                                    answer
                                </div>
                                <div className="choice1 tableCell">
                                    choice1
                                </div>
                                <div className="choice1Id tableCell">
                                    choice1_id
                                </div>
                                <div className="choice1Img tableCell">
                                    choice1_img
                                </div>
                                <div className="choice1 tableCell">
                                    choice2
                                </div>
                                <div className="choice1Id tableCell">
                                    choice2_id
                                </div>
                                <div className="choice1Img tableCell">
                                    choice2_img
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
            testQuestionList: data
        });
    },

    refreshData: function() {
        Utils.Store.makeCall('getIslandsWithDetails');
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
        var islandName = event.target.value;
        var localStore = Utils.Store.getStore('testQuestionList-' + islandName);
        if (event.target.id === 'selectedIsland') {
            if (localStore) {
                this.setState({
                    testQuestionList: localStore,
                    selectedIsland: islandName
                });
            } else {
                Utils.Store.makeCall('getTestQuestions', {
                    island_name: islandName
                });
                Utils.Dispatcher.register('testQuestionList-' + event.target.value + '-change', [], this.handleListChange);
                this.setState({
                    selectedIsland: islandName
                });
            }
            return;
        }
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
        var data = this.recordMap[id];

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

module.exports = Radium(IslandOverview);
