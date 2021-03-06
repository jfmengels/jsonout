'use strict';

var _   = require('underscore'),
    clc = require('cli-color');

function Formatter() {}

Formatter.prototype.colors = {
    string: clc.green,
    number: clc.yellow,
    'null': clc.bold
};

Formatter.prototype.formats = {
    pretty: {
        indent: '    ', // 4 spaces
        innerObjectIndent: true,
        quotes: '\"',
        backToLine: true,
        afterColon: ' '
    },
    flat: {
        indent: '',
        innerObjectIndent: false,
        quotes: '\"',
        backToLine: false,
        afterColon: ''
    }
};

Formatter.prototype.withColor = function(data, ctx) {
    var result = {};
    for (var key in data) {
        result[key] = this.colorElement(data[key], ctx);
    }
    return result;
};

Formatter.prototype.colorElement = function(element, ctx) {
    var newValue;

    if (_.isString(element)) {
        newValue = this.colors.string(ctx.quotes + element + ctx.quotes);
    }
    else if (_.isNumber(element)) {
        newValue = this.colors.number(element);
    }
    else if (_.isNull(element)) {
        newValue = this.colors['null']('null');
    }
    else if (_.isArray(element)) {
        newValue = [];
        for(var index in element) {
            newValue.push(this.colorElement(element[index], ctx));
        }
    }
    else if (_.isObject(element)) {
        newValue = this.withColor(element, ctx);
    }

    if (newValue === undefined) {
        console.error('Element of unexpected type: ' + element);
        process.exit(0);
    }
    return newValue;
};



Formatter.prototype.elementToString = function(value, ctx, level) {
    if (_.isArray(value)) {
        return this.arrayToString(value, ctx, level);
    }
    else if (_.isObject(value)) {
        return this.objectToString(value, ctx, level);
    }
    else {
        return value;
    }
};



Formatter.prototype.itemSeparator = function(ctx, level) {
    var separator = '';
    if (ctx.backToLine) {
        separator += '\n';
    }
    return separator + this.indent(ctx, level);
};



Formatter.prototype.indent = function(ctx, level) {
    var indent = '';
    if (ctx.indent) {
        for (var i = 0; i < level; i++) {
            indent += ctx.indent;
        }
    }
    return indent;
};

Formatter.prototype.objectToString = function(obj, ctx, level) {
    if (!level) {
        level = 1;
    }

    var keys = Object.keys(obj);
    if (keys.length === 0) {
        return '{}';
    }

    var self = this,
        start = '{',
        separator = this.itemSeparator(ctx, level),
        end = (ctx.backToLine ? '\n' : '') + this.indent(ctx, level - 1) + '}';

    var elements = keys.map(function(key) {
        return self.elementToString(obj[key], ctx, level + 1);
    });

    var items = _.zip(keys, elements).map(function(item) {
        return ctx.quotes + item[0] + ctx.quotes + ':' + ctx.afterColon + item[1];
    });

    return start + separator + items.join(',' + separator) + end;
};

Formatter.prototype.arrayToString = function(array, ctx, level) {
    if (array.length === 0) {
        return '[]';
    }

    var self = this,
        start = '[',
        separator = this.itemSeparator(ctx, level),
        end = (ctx.backToLine ? '\n' : '') + this.indent(ctx, level - 1) + ']',
        items = array.map(function(elt) {
            return self.elementToString(elt, ctx, level + 1);
        });

    return start + separator + items.join(',' + separator) + end;
};

module.exports = Formatter;