'use strict';

var _   = require('underscore'),
    clc = require('cli-color');

function Formatter() {};

Formatter.prototype.colors = {
    string: clc.green,
    number: clc.yellow,
    "null": clc.bold
};

Formatter.prototype.formats = {
    pretty: function(data, options) {
        return JSON.stringify(data, null, options.indent);
    },
    flat: function(data, options) {
        return JSON.stringify(data);
    }
};

Formatter.prototype.withColor = function(data) {
    var result = {};
    for (var key in data) {
        result[key] = this.colorElement(data[key]);
    }
    return result;
};

Formatter.prototype.colorElement = function(element) {
    var newValue = undefined;

    if (this.colors[typeof element]) {
        newValue = new String(this.colors[typeof element](element));
    }
    else if (element === null) {
        newValue = this.colors["null"]("null");
    }
    else if (_.isArray(element)) {
        newValue = [];
        for(var index in element) {
            newValue.push(this.colorElement(element[index]));
        }
    }
    else if (_.isObject(element)) {
        newValue = this.withColor(element);
    }


    if (newValue === undefined) {
        exit("Value of unexpected type for key: " + key);
    }
    return newValue;
};

module.exports = Formatter;