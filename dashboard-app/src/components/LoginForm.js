var React = require('react');
var Utils = require('Utils');

var DataMixin = require('DataMixin');
var FormMixin = require('FormMixin');

var LoginForm = React.createClass({

    mixins: [FormMixin, DataMixin],

    render: function() {

        return (
            <div className="form-container">
                <label className="label label--block">
                    Username:
                </label>
                <input className="input input--block input--signout" type="text" id="identity" />
                <label className="label label--block">
                    Password:
                </label>
                <input className="input input--block input--signout" type="password" id="loginPassword" />
                <input className="button button--block" type="submit"
                    onClick={this.handleSubmitClick} value="Sign in" />
            </div>
        );
    },

    handleSubmitClick: function(event) {
        // We won't be using React's `state` object here because some browsers
        // autopopulate login and registration forms, which messes with us
        // because they don't fire events that we can hook onto to update the
        // component state object.
        //
        // TODO: Make IDs into data-attributes so we don't have to overqualify the
        // password ID

        var identity = $('#identity').val();
        var password = $('#loginPassword').val();

        if (!identity || !password) {
            Utils.Dispatcher.dispatch('error-message', { message: "Username and Password are required."});
        } else {
            var data = {
                "identity": identity,
                "password": password
            };
            this.loginUser(data, this.handleSuccess, this.handleError);
        }
    },

    handleSuccess: function(data, status, xhr) {
        console.log('SUCCESS: ',data, status, xhr);
        this.clearAllMessages();
        this.hideLoadingScreen();
        Utils.Dispatcher.dispatch('change-main-component', {page: "home"});
        Utils.Dispatcher.dispatch('user-state', { loggedIn: true });

        // TODO: pull this out of the login form
        // Register island list data call and make it
        Utils.Store.registerCall('getIslandsWithDetails', this.getIslandsWithDetails,
            function(data, xhr, status) {
                var data = JSON.parse(data).data;
                var repeatCheck = [];

                var gradeOptions = [{
                    value: '',
                    label: 'All'
                }];

                var islandOptions = [{
                    value: '',
                    label: 'All'
                }];

                data.islands.forEach(function(record) {
                    if (repeatCheck.indexOf(record.grade_level) === -1) {
                        repeatCheck.push(record.grade_level);
                        gradeOptions.push({
                            value: record.grade_level,
                            label: record.grade_level
                        });
                    }
                    if (repeatCheck.indexOf(record.island_name) === -1) {
                        repeatCheck.push(record.island_name);
                        islandOptions.push({
                            value: record.island_name,
                            label: record.island_name
                        });
                    }
                });

                Utils.Store.addDataToStore(data.islands, 'islandList');
                Utils.Store.addDataToStore(islandOptions, 'islandOptions');
                Utils.Store.addDataToStore(gradeOptions, 'gradeOptions');
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error getting islands with details. Server responded: ' + data.responseJSON.msg});
            }, true);

        Utils.Store.registerCall('updateIsland', this.updateIsland,
            function(data, xhr, status) {
                var dataJSON = JSON.parse(data).data;
                Utils.Store.updateDataById(dataJSON, 'islandList', dataJSON.id);

                // This gets all data all over again. Instead, try and just update the record
                // that we just updated.
                // Utils.Store.makeCall('getIslandsWithDetails');
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error updating island. Server responded: ' + data.responseJSON.msg});
            }
        );

        // Register test question data call, store data in a per-island test question store
        Utils.Store.registerCall('getTestQuestions', this.getAllTestQuestions,
            function(data, xhr, status) {
                var islandName = JSON.parse(data).data.questions[0].island;
                var storeName = 'testQuestionList-' + islandName;
                Utils.Store.addDataToStore(JSON.parse(data).data.questions, storeName);


                // Update question_id to island_name map
                var newMap = {};
                var storeSource = Utils.Store.getStore(storeName);
                for (var i = 0; i < storeSource.length; i++) {
                    newMap[storeSource[i].id] = storeSource[i].island;
                }
                Utils.Store.addDataToStore(newMap, 'questionIdToIslandNameMap');
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error getting test questions. Server responded: ' + data.responseJSON.msg});
            }
        );

        Utils.Store.registerCall('updateTestQuestion', this.updateTestQuestion,
            function(data, xhr, status) {
                var dataJSON = JSON.parse(data).data;
                var island = JSON.parse(data).data.island;
                Utils.Store.updateDataById(dataJSON, 'testQuestionList-' + island, dataJSON.id);

                // This gets all data all over again. Instead, try and just update the record
                // that we just updated.
                // Utils.Store.makeCall('getIslandsWithDetails');
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error updating question. Server responded: ' + data.responseJSON.msg});
            }
        );

        Utils.Store.registerCall('createTestQuestion', this.createTestQuestion,
            function(data, xhr, status) {
                var dataJSON = JSON.parse(data).data;
                var island = JSON.parse(data).data.island;
                Utils.Store.addDataToStore(dataJSON, 'testQuestionList-' + island);

                // This gets all data all over again. Instead, try and just update the record
                // that we just updated.
                // Utils.Store.makeCall('getIslandsWithDetails');
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error adding question. Server responded: ' + data.responseJSON.msg});
            }
        );

        Utils.Store.registerCall('deleteTestQuestion', this.deleteTestQuestion,
            function(data, xhr, status, origData) {
                var map = Utils.Store.getStore('questionIdToIslandNameMap');
                var islandName = map[origData['question_id']];
                Utils.Store.removeDataById('testQuestionList-' + islandName, origData['question_id']);
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error deleting question. Server responded: ' + data.responseJSON.msg});
            }
        );

        Utils.Store.registerCall('getFamilyByEmail', this.getFamilyByEmail,
            function(data, xhr, status, origData) {
                var data = JSON.parse(data).data;
                if (data.family && !Array.isArray(data.family)) {
                    data.family = [data.family];
                }
                Utils.Store.addDataToStore(data.family, 'familyData');
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error getting family. Server responded: ' + data.responseJSON.msg});
            }
        );

        Utils.Store.registerCall('getStudents', this.getStudents,
            function(data, xhr, status, origData) {
                var data = JSON.parse(data).data;
                Utils.Store.addDataToStore(data, 'studentData');
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error getting students. Server responded: ' + data.responseJSON.msg});
            }
        );

        Utils.Store.registerCall('getStudentsFilterValues', this.getStudents,
            function(data, xhr, status) {
                var data = JSON.parse(data).data;
                Utils.Store.addDataToStore(data, 'studentFilters');
            },
            function(data, xhr, status) {
                Utils.Dispatcher.dispatch('error-message', {message: 'Error getting student filter values. Server responded: ' + data.responseJSON.msg});
            },
            true,
            {
                'pre_flight': true
            }
        );
    },

    handleError: function(data, status, xhr) {
        console.log('ERROR: ',data, status, xhr);
        this.hideLoadingScreen();
        Utils.Dispatcher.dispatch('error-message', {message: "Login failed. Please try again.  Server responded: " + data.responseJSON.msg});
    }
});

module.exports = LoginForm;
