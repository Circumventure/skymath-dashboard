var React = require('react');
var Utils = require('Utils');

var InputText = require('InputText');
var InputFile = require('InputFile');

var EditableTableCell = React.createClass({
    getInitialState: function() {
        var initState = {
            highlight: false,
            data: {}
        };
        initState['data'][this.props.name] = this.props.value;
        return initState;
    },

    componentWillReceiveProps: function(nextProps) {
        var newData = {};
        newData[nextProps.name] = nextProps.value;
        this.setState({
            data: newData
        });
    },

    render: function() {
        var style = {
            height: '170px'
        };

        if (this.state.activeEdit && this.props.editable) {
            var textareaStyle = {
                height: '70%',
                width: '100%',
                color: '#111',
                fontSize: '0.85em',
                lineHeight: '1.4em'
            };

            var field = this.props.name;

            if (this.props.fieldType === 'image') {
                return (
                    <div>
                        <InputFile inputClass="{'input ' + field}" labelClass="label" className="fieldset fieldset--addedit" onChange={this.onInputChange} label={field} id={field} />
                        <div>
                            <InputText className="fieldset fieldset--addedit" labelClass="label" inputClass={field + ' input'} id={field} label={field} value={this.state.data[field]} onChange={this.onInputChange} />
                            <div>
                                <a onClick={this.saveField}>Save</a> <a onClick={this.cancelSave}>Cancel</a>
                            </div>
                            <div className="imageContainer" id={field + '_container'} style={{display: 'inline-block'}}>
                                {this.state.data[field] ? [<img src={this.state.data[field]} id={field + '_image'} />] : null}
                            </div>
                            <div className="canvasContainer" id={field + '_canvas_container'} style={{display: 'inline-block'}}>
                                <canvas id={field + '_canvas'}></canvas>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className={this.props.name + ' tableCell'} id={this.props.name} onMouseOver={this.handleHover} onMouseOut={this.handleMouseOut} style={style}>
                    <textarea value={this.state.data[this.props.name]} onChange={this.onInputChange} style={textareaStyle} />
                    <a onClick={this.saveField}>Save</a> <a onClick={this.cancelSave}>Cancel</a>
                </div>
            );
        } else {
            var style = this.state.highlight && this.props.editable ? {
                backgroundColor: 'rgba(34, 188, 205, 0.97)',
                cursor: 'pointer'
            } : null;
            return (
                <div className={this.props.name + ' tableCell'} id={this.props.name} onClick={this.handleCellClick} onMouseOver={this.handleHover} onMouseOut={this.handleMouseOut} style={style}>
                    {this.props.value}
                </div>
            );
        }
    },

    onInputChange: function(event) {
        var newValue = {};
        if (event.target.type === 'file') {
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
                newValue[targetId + '_upload'] = data;
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

                this.setState({
                    data: newValue
                });
            }.bind(this);
            fr.readAsDataURL(file);
        } else {
            var newValue = {};
            newValue[this.props.name] = event.target.value;
            this.setState({
                data: newValue
            });
        }
    },

    handleHover: function() {
        this.setState({
            highlight: true
        });
    },

    handleMouseOut: function() {
        this.setState({
            highlight: false
        });
    },

    handleCellClick: function(event) {
        this.setState({
            activeEdit: true
        });
    },

    saveField: function(event) {
        this.setState({
            activeEdit: false
        });

        var data = $.extend({},this.state.data);
        data['question_id'] = this.props.recordId;

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

        Utils.Store.makeCall('updateTestQuestion', data);
    },

    cancelSave: function() {
        this.setState({
            activeEdit: false
        });
    }
});

module.exports = EditableTableCell;
