/*!
 * todo - Todos in the CLI like what.
 * 
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

var app = require('./app');

/**
 * Module dependencies.
 */
var colors = require('colors');

/**
 * Formatter namespace.
 * 
 * @type {Object}
 */
var formatter = module.exports;

/**
 * Formats an item.
 * 
 * @param {Object} Todo item.
 * @param {Number} Item number.
 * @returns {String}
 * @api public
 */
formatter.format = function(item, num) {
  var state = (item.done) ? '√'.green : '✖'.red;
  
  return '     '
    +  '#' + (num + 1) + '  '
    + state + '  '
    + item.text;
};
