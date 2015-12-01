var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputFile = require('InputFile');
var InputText = require('InputText');
var InputSelect = require('InputSelect');

var TestQuestionDetail = React.createClass({
    mixins: [DataMixin],

    getInitialState: function() {
        return {
            island: '',
            standard: '',
            source: '',
            source_id: '',
            is_checked: '',
            diagnostic_use: '',
            gatekeeper_use: '',
            question_text: '',
            question_spoken: '',
            question_image_upload: '',
            question_image: '',
            answer: '',
            choice1: '',
            choice1_id: '',
            choice1_img_upload: '',
            choice1_img: '',
            choice2: '',
            choice2_id: '',
            choice2_img_upload: '',
            choice2_img: ''
        };
    },

    isFileField: function(fieldname) {
        if (fieldname.indexOf('_upload') > -1) {
            return true;
        }
        return false;
    },

    isImageUrlField: function(fieldname) {
        var urlFields = [
            'choice1_img',
            'choice2_img',
            'question_image'
        ];
        if (urlFields.indexOf(fieldname) > -1) {
            return true;
        }
        return false;
    },

    componentWillMount: function() {
        var newState = {};
        if (this.props && this.props.data) {
            for (var key in this.props.data) {
                if (this.state[key] !== undefined) {
                    newState[key] = this.props.data[key];
                }
            }
        }
        this.setState(newState);
    },

    render: function() {

        var fields = Object.keys(this.state).map(function(field) {
            if (this.isFileField(field)) {
                return (
                    <InputFile inputClass="{'input ' + field}" labelClass="label" className="fieldset fieldset--addedit" onChange={this.handleChange} label={field} id={field} />
                );
            }
            if (this.isImageUrlField(field)) {
                return (
                    <div>
                        <InputText className="fieldset fieldset--addedit" labelClass="label" inputClass={field + ' input'} id={field} label={field} value={this.state[field]} onChange={this.handleChange} />
                        <div className="imageContainer" id={field + '_container'} style={{display: 'inline-block'}}>
                            {this.state[field] ? [<img src={this.state[field]} id={field + '_image'} />] : null}
                        </div>
                        <div className="canvasContainer" id={field + '_canvas_container'} style={{display: 'inline-block'}}>
                            <canvas id={field + '_canvas'}></canvas>
                        </div>
                    </div>
                );
            }

            // If this is the "island" field, populate a select list instead of
            // a text field
            if (field === 'island') {
                return (
                    <InputSelect label="Select Island:" options={this.props.islandOptions} id="island" onChange={this.handleChange} value={this.state[field]} />
                );
            }

            return (
                <InputText className="fieldset fieldset--addedit" labelClass="label" inputClass={field + ' input'} id={field} label={field} value={this.state[field]} onChange={this.handleChange} />
            );
        }, this);

        return (
            <div className="TestQuestionDetail">
                <input className="button button--inline" type="button" value="Save" onClick={this.handleSave} />
                <input className="button button--inline" type="button" value="Cancel" onClick={this.backToOverview} />
                {fields}
                <input className="button button--inline" type="button" value="Save" onClick={this.handleSave} />
                <input className="button button--inline" type="button" value="Cancel" onClick={this.backToOverview} />
            </div>
        );
    },

    backToOverview: function(event) {
        Utils.Dispatcher.dispatch('change-testQuestion-overview', { view: 'overview' });

    },

    handleChange: function(event) {
        var newValue = {};
        if (this.isFileField(event.target.id)) {
            var data = '';
            var re = /data\:image\/\w{2,}\;base64\,/;
            var match;
            var targetId = event.target.id;
            var targetIdSplit = event.target.id.split('_');
            var prefix = targetIdSplit[0] + '_' + targetIdSplit[1];
            var mimeFieldName = prefix + '_mime';
            var fr = new FileReader();
            var file = event.target.files[0];
            fr.onloadend = function() {
                data = fr.result;
                match = data.match(re);
                if (match) {
                    data = data.substr(match[0].length);
                }
                newValue[targetId] = data;
                newValue[mimeFieldName] = match[0].split(';')[0].split(':')[1];

                // Clear out current values
                newValue[prefix] = '';

                // Draw the image onto the canvas element
                var canvas = document.getElementById(prefix + '_canvas');
                if (canvas) {
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    // Hacky, not sure why canvas element is disappearing
                    $('#' + prefix + 'container').html('<canvas id="' + prefix + 'canvas"></canvas>');
                    canvas = document.getElementById(prefix + '_canvas');
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                var img = new Image;
                img.src = URL.createObjectURL(file);
                img.onload = function() {
                    ctx.drawImage(img, 20,20);
                }

                this.setState(newValue);
            }.bind(this);
            fr.readAsDataURL(file);
        } else {
            newValue[event.target.id] = event.target.value;
            this.setState(newValue);
        }
    },

    handleSave: function() {
        var data = $.extend({},this.state);
        var fieldsToDelete = [
            'choice1_img',
            'choice2_img',
            'question_image'
        ];
        for (var i = 0; i < fieldsToDelete.length; i++) {
            if (data[fieldsToDelete[i] + '_upload']) {
                delete data[fieldsToDelete[i]];
            }
        }
        Utils.Store.makeCall('createTestQuestion', data);
        this.backToOverview();
    },
});

module.exports = TestQuestionDetail;
