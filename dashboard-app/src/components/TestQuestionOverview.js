var React = require('react');
var Radium = require('radium');
var Style = Radium.Style;

var AlertModal = require('AlertModal');
var Utils = require('Utils');
var DataMixin = require('DataMixin');
var EditableTableCell = require('EditableTableCell');
var InputSelect = require('InputSelect');
var IslandDetail = require('IslandDetail');
var TestQuestionDetail = require('TestQuestionDetail');

var islandOptions;
var gradeOptions;

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

        if (!islandOptions) {
            islandOptions = Utils.Store.getStore('islandOptions');
        }

        if (!gradeOptions) {
            gradeOptions = [].concat(Utils.Store.getStore('gradeOptions'));
            // TODO: Backend is storing kindergarten value as K for islands, 0
            // for test questions :( Get them to fix...
            for (var i = 0; i < gradeOptions.length; i++) {
                if (gradeOptions[i].value === 'K') {
                    gradeOptions[i].value = 0;
                    gradeOptions[i].label = 0;
                }
            }
        }

        switch(this.state.view) {
        case 'create':
            return (
                <TestQuestionDetail mode={this.state.view} refresh={this.refreshData} data={{ island: this.state.selectedIsland }} islandOptions={islandOptions} />
            );
        // case 'edit':
        //     return (
        //         <IslandDetail mode={this.state.view} data={this.state.selectedRecordData} refresh={this.refreshData} />
        //     );
        case 'overview':
            /**
             * Dict of fields and whether they are editable or not
             */
            var fieldConfig = {
                island: false,
                standard: true,
                source: true,
                source_id: true,
                is_checked: true,
                diagnostic_use: true,
                gatekeeper_use: true,
                question_text: true,
                question_spoken: true,
                question_image: true,
                answer: true,
                choice1: true,
                choice1_id: true,
                choice1_img: true,
                choice2: true,
                choice2_id: true,
                choice2_img: true,
                choice3: true,
                choice3_id: true,
                choice3_img: true,
                choice4: true,
                choice4_id: true,
                choice4_img: true
            };
            var islandData = [];
            this.state.testQuestionList.forEach(function(record) {
                this.recordMap[record.id] = record;
                var islandFilter = this.state.selectedIsland;
                var gradeFilter = this.state.selectedGrade;

                if ((islandFilter && record.island !== islandFilter) || (gradeFilter && record.grade.toString() !== gradeFilter)) {
                    return;
                }

                var islandRows = [];
                var imageFields = [
                    'question_image',
                    'choice1_img',
                    'choice2_img',
                    'choice3_img',
                    'choice4_img'
                ];

                for (var field in fieldConfig) {
                    var imageFieldType = imageFields.indexOf(field) > -1 ? 'image' : '';
                    islandRows.push(
                        <EditableTableCell recordId={record.id} name={field} value={record[field]} editable={fieldConfig[field]} fieldType={imageFieldType} />
                    );
                }

                islandData.push(
                    <div className="islandRow tableRow" id={'id_' + record.id}>
                        {islandRows}
                        <div className='deleteButton tableCell'>
                            <button className="button button--block" type="button" value={record.id} onClick={this.handleDelete}>Delete</button>
                        </div>
                    </div>
                );
                return;
            }, this);

            var islandHeaderCells = [];
            Object.keys(fieldConfig).map(function(field) {
                islandHeaderCells.push(
                    <div className={field + ' tableCell'}>
                        {field}
                    </div>
                );
            });

            var islandHeader = [
                <div className="islandRow header tableRow">
                    {islandHeaderCells}
                </div>
            ];
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
                            <InputSelect label="Select Island:" options={islandOptions} id="selectedIsland" onChange={this.applyFilter} />
                        </div>
                        <div className="select-grade tableCell filterContainers">
                            <InputSelect label="Select Grade:" options={gradeOptions} id="selectedGrade" onChange={this.applyFilter} />
                        </div>
                    </div>
                    <div className="operations">
                        {this.state.selectedIsland ? [<input className="button button--block" type="button" value="New" onClick={this.handleCreateNew} />] : []}
                    </div>
                    <div className="line">
                        <div className="box size12of12">
                            {islandHeader}
                            {islandData}
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

    handleDelete: function(event) {
        var handleConfirm = function(questionId) {
            React.unmountComponentAtNode(document.getElementById('alert'));
            Utils.Store.makeCall('deleteTestQuestion', {
                question_id: questionId
            });
        };

        var handleCancel = function() {
            React.unmountComponentAtNode(document.getElementById('alert'));
        };

        React.render(
            <AlertModal handleConfirm={handleConfirm} handleCancel={handleCancel} data={event.target.value} confirmMsg="Confirm" cancelMsg="Cancel" message="This will delete this question. Are you sure?" />,
            document.getElementById('alert')
        );
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
