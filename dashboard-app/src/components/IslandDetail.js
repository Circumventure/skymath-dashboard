var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');

var IslandDetail = React.createClass({
    mixins: [DataMixin],

    getInitialState: function() {
        return {};
    },

    render: function() {

        this.getIslandData('Learn to Add', this.islandDataSuccess, this.islandDataError)

        return (
            <div className="island-detail">
                <div className="line">
                    <div className="box size12of12">
                        Island Details
                    </div>
                </div>
            </div>
        );
    },

    islandDataSuccess: function(data, xhr, status) {
        console.log('SUCCESS>>>', data);
    },

    islandDataError: function(data, xhr, status) {
        console.log('ERROR>>>', data);
    },    

});

module.exports = IslandDetail;