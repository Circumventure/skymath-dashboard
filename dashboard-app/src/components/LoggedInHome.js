var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');

var LoggedInHome = React.createClass({
    mixins: [DataMixin],

    componentWillMount: function() {
        if (!Utils.Store.getStore('statistics')) {
            this.getStatistics(this.getStatsSuccess, this.getStatsError);
        } else {
            this.loadData(Utils.Store.getStore('statistics'));
        }
    },

    getInitialState: function() {

        return {
            total: null,
            active: null,
            inactive: null,
            kindergartaen: null,
            firstGrade: null,
            secondGrade: null,
            thirdGrade: null,
            fourthGrade: null
        };

    },

    render: function() {

        return (
            <div className="logged-in-home">
                <div className="line">
                    <div className="box col-2 size6of12">
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth larger-type">Total Users</div>
                            <div className="read-only  field field--fixedwidth larger-type">{this.state.total}</div>
                        </fieldset>
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth larger-type">Active</div>
                            <div className="read-only  field field--fixedwidth larger-type">{this.state.active}</div>
                        </fieldset>
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth larger-type">Inactive<br />
                            <span className="small-type">(no activity in one month or more)</span></div>
                            <div className="read-only  field field--fixedwidth larger-type">{this.state.inactive}</div>
                        </fieldset>
                    </div>
                    <div className="box col-2 size6of12">
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth large-type">Kindergarten</div>
                            <div className="read-only  field field--fixedwidth large-type">{this.state.kindergartaen}</div>
                        </fieldset>
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth large-type">1st Grade</div>
                            <div className="read-only  field field--fixedwidth large-type">{this.state.firstGrade}</div>
                        </fieldset>
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth large-type">2nd Grade</div>
                            <div className="read-only  field field--fixedwidth large-type">{this.state.secondGrade}</div>
                        </fieldset>
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth large-type">3rd Grade</div>
                            <div className="read-only  field field--fixedwidth large-type">{this.state.thirdGrade}</div>
                        </fieldset>
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth large-type">4th Grade</div>
                            <div className="read-only  field field--fixedwidth large-type">{this.state.fourthGrade}</div>
                        </fieldset>
                    </div>
                </div>
            </div>
        );
    },

    loadData: function(data) {
        this.setState(data);
    },

    getStatsSuccess: function(data, xhr, status) {
        var data = JSON.parse(data).data;
        if (!Object.keys(data).length) {
            Utils.Dispatcher.dispatch('error-message', {
                message: 'Got a success response from server but no data.'
            });
        }
        Utils.Dispatcher.dispatch('new-item', { data: data, storeName: 'statistics' });
        this.loadData(data);
    },

    getStatsError: function(data, xhr, status) {
        console.log(data);
        Utils.Dispatcher.dispatch('error-message', {
            message: 'There was an error getting statistics. Server responded: ' + data.data.msg
        });
    },

});

module.exports = LoggedInHome;