var React = require('react');

var Utils = require('Utils');
var DataMixin = require('DataMixin');
var InputFile = require('InputFile');
var InputText = require('InputText');

var AppDetail = React.createClass({
    mixins: [DataMixin],

    getInitialState: function() {
        return {
            'island_name': '',
            'total_cost_of_3_apps': '',
            'total_cost_of_4_apps': '',
            'app1_name': '',
            'app1_image_upload': null,
            'app1_icon_url': '',
            'app1_link': '',
            'app1_notes': '',
            'app1_price': '',
            'app1_video': '',
            'app2_name': '',
            'app2_image_upload': null,
            'app2_icon_url': '',
            'app2_link': '',
            'app2_notes': '',
            'app2_price': '',
            'app2_video': '',
            'app3_name': '',
            'app3_image_upload': null,
            'app3_icon_url': '',
            'app3_link': '',
            'app3_notes': '',
            'app3_price': '',
            'app3_video': '',
            'app4_name': '',
            'app4_image_upload': null,
            'app4_icon_url': '',
            'app4_link': '',
            'app4_notes': '',
            'app4_price': '',
            'app4_video': '',
        };
    },

    isFileField: function(fieldname) {
        if (fieldname.indexOf('image_upload') > -1) {
            return true;
        }
        return false;
    },

    isImageUrlField: function(fieldname) {
        if (fieldname.indexOf('_icon_url') > -1) {
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
            return (
                <InputText className="fieldset fieldset--addedit" labelClass="label" inputClass={field + ' input'} id={field} label={field} value={this.state[field]} onChange={this.handleChange} />
            );
        }, this);

        return (
            <div className="IslandDetail">
                <input className="button button--inline" type="button" value="Save" onClick={this.handleSave} />
                <input className="button button--inline" type="button" value="Cancel" onClick={this.backToOverview} />
                {fields}
                <input className="button button--inline" type="button" value="Save" onClick={this.handleSave} />
                <input className="button button--inline" type="button" value="Cancel" onClick={this.backToOverview} />
            </div>
        );
    },

    backToOverview: function(event) {
        Utils.Dispatcher.dispatch('change-island-overview', { view: 'overview' });

    },

    handleChange: function(event) {
        var newValue = {};
        if (this.isFileField(event.target.id)) {
            var data = '';
            var re = /data\:image\/\w{2,}\;base64\,/;
            var match;
            var targetId = event.target.id;
            var appNumber = targetId.split('_')[0];
            var mimeFieldName = appNumber + '_image_mime';
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
                newValue[appNumber + '_icon_url'] = '';

                // Draw the image onto the canvas element
                var canvas = document.getElementById(appNumber + '_icon_url_canvas');
                if (canvas) {
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    // Hacky, not sure why canvas element is disappearing
                    $('#' + appNumber + '_icon_url_container').html('<canvas id="' + appNumber + '_icon_url_canvas"></canvas>');
                    canvas = document.getElementById(appNumber + '_icon_url_canvas');
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

        } else if (this.isImageUrlField(event.target.id)) {
            newValue[event.target.id] = event.target.value;
            this.setState(newValue)
        } else {
            newValue[event.target.id] = event.target.value;
            this.setState(newValue);
        }
    },

    handleSave: function() {
        var data = $.extend({},this.state);
        for (var i = 1; i < 5; i++) {
            if (data['app' + i + '_image_upload']) {
                delete data['app' + i + '_icon_url'];
            }
        }
        Utils.Store.makeCall('updateIsland', data);
        this.backToOverview();
    },
});

module.exports = AppDetail;
