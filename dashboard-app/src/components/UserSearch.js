var React = require('react');
var Radium = require('radium');
var Style = Radium.Style;

var FormMixin = require('FormMixin');
var InputText = require('InputText');
var Utils = require('Utils');

var UserSearch = React.createClass({
    mixins: [FormMixin],

    kidFields: [
        'screenname',
        'grade',
        'activeIsland',
        'curriculum',
        'grade',
        'islands'
        // skills learned?
        // starting level island name?
        // starting island?
        // starting level grade equivalency ?
    ],

    componentWillMount: function() {
        Utils.Dispatcher.register('familyData-change', [], this.handleReceiveData);
        Utils.Dispatcher.dispatch('change-header-title', {
            title: 'Families:',
            subtitle: 'Search Families By Email'
        });
        Utils.Dispatcher.dispatch('change-menu-highlight', {
            current: 'user-search'
        });
    },

    componentWillUnmount: function() {
        // Restore app width
        var container = document.querySelector('.admin-app > .line > div');
        $(container).addClass('size9of12').removeClass('size12of12');
    },

    getInitialState: function() {
        return {
            data: [],
            nextIndex: null,
            prevIndex: null,
            currIndex: 0,
            familyId: '',
            // pinNumber: ''
        }
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
        for (var i = 0; i < kidData.length; i++) {
            var currData = kidData[i];
            var cells = [];

            this.kidFields.map(function(field) {
                cells.push(<div className={field + ' tableCell'}>
                    {this.state.data[field]}
                </div>);
            });
            kidRows.push(<div className="islandRow tableRow">{cells}</div>);
        }

        return (
            <div className="user-search UserSearch">
                    <Style rules={{
                        '#MainComponent': {
                            overflow: 'scroll'
                        },
                        '.UserSearch .header': {
                            fontSize: '0.85em !important'
                        }
                    }} />
                    <Style scopeSelector=".UserSearch"
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
                    <div className="box size12of12">
                        <InputText label="Family Email Address:" className="fieldset familyEmail" id="familyEmailAddress" />
                        <button className="button button--inline-right" onClick={this.submitFamilyEmail}>Go</button>
                    </div>
                </div>
                <div className="line">
                    <div className="display-inline-block family-info" style={{ marginRight: '20px' }}>
                        <h2 className="h2">Family Id</h2>
                        <p className="h3">{this.state.familyId}</p>
                    </div>
                    <div className="display-inline-block float-right controls">
                        <p className={'arrow display-inline-block ' + (this.state.prevIndex ? '' : 'disabled')} id="goBack" onClick={this.handleChangePos}>{String.fromCharCode(9664)}</p>
                        <p className={"arrow display-inline-block " + (this.state.nextIndex ? "" : "disabled")} id="goForward" onClick={this.handleChangePos}>{String.fromCharCode(9654)}</p>
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

    submitFamilyEmail: function(event) {
        this.clearAllMessages();
        var value = $('#familyEmailAddress').val();
        var emailRe = /[\w\.\-]+\@[\w\-\.]+\.\w{2,}/;
        if (!value.match(emailRe)) {
            Utils.Dispatcher.dispatch('error-message', {message: 'You must enter a valid email address.'});
            return;
        }
        Utils.Store.makeCall('getFamilyByEmail', {
            email: value
        });
    },

    handleReceiveData: function(data) {
        var currIndex = this.state.currIndex;
        
        // Do some data sanitization for this view
        var newCurriculum = [];
        if (data['curriculum']) {
            for (var i = 0; i < data['curriculum'].length; i++) {
                newCurriculum.push(data['curriculum'][i].name)
            }
        }

        var newIslands = [];
        if (data['islands']) {
            for (var i = 0; i < data['islands'].length; i++) {
                newIslands.push(data['islands'][i].island_name)
            }
        }

        data['curriculum'] = newCurriculum.join();
        data['islands'] = newIslands.join();

        this.setState({
            familyId: data[currIndex]['family_id'],
            data: data,
            currIndex: 0, // resetting the current record
            nextIndex: data[currIndex + 1] ? currIndex + 1 : null,
            prevIndex: data[currIndex - 1] ? currIndex - 1 : null
        });
    },

    handleChangePos: function(event) {
        var newPos;
        if (event.target.id === 'goBack') {
            newPos = this.state.currIndex - 1;
        } else {
            newPos = this.state.currIndex + 1;
        }

        this.setState({
            currIndex: newPos,
            nextIndex: this.state.data[newPos + 1] ? newPos + 1 : null,
            prevIndex: this.state.data[newPos - 1] ? newPos - 1 : null
        })
    }

});

module.exports = UserSearch;