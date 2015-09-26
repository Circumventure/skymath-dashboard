var React = require('react');

var Utils = require('Utils');

var LoggedInHome = React.createClass({
    getInitialState: function() {

        // return {
        //     totalUsers: null,
        //     active: null,
        //     inactive: null,
        //     kindergarten: null,
        //     firstGrade: null,
        //     secondGrade: null,
        //     thirdGrade: null,
        //     fourthGrade: null
        // };

        return {
            totalUsers: 20,
            active: 20,
            inactive: 20,
            kindergarten: 20,
            firstGrade: 20,
            secondGrade: 20,
            thirdGrade: 20,
            fourthGrade: 20
        };

    },

    render: function() {

        return (
            <div className="logged-in-home">
                <div className="line">
                    <div className="box col-2 size6of12">
                        <fieldset className="inline-fields fieldset">
                            <div className="label label--fixedwidth larger-type">Total Users</div>
                            <div className="read-only  field field--fixedwidth larger-type">{this.state.totalUsers}</div>
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
                            <div className="read-only  field field--fixedwidth large-type">{this.state.kindergarten}</div>
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
    }

});

module.exports = LoggedInHome;