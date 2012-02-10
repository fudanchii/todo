/*!
 * todo - Todos in the CLI like what.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

/**
 * Commands namespace.
 *
 * @type {Object}
 */
var commands = module.exports;

/**
 * Print alias.
 *
 * @api private
 */
commands.print = function(value) {
  console.log(value);
};

/**
 * Format items for print.
 *
 * @api private
 */
commands.format = function(items) {
  return "\n" + items.map(format).filter(function(elm, i, arr) {
    if (elm === '') { return false; }
    return true;
  }).join("\n") + "\n";
};

/**
 * The application.
 *
 * @type {Object}
 */
var app = require('./app');

/**
 * Formatter.
 *
 * @type {Object}
 */
var format = require('./formatter').format;

/**
 * To-Do list name
 * Default to items
 *
 * @type {String}
 */
var list = 'items';

/**
 * File writing.
 */
var fs = require('fs');

/**
 * Initializes the commands by given todos.
 *
 * @api public
 */
commands.init = function(todos) {
  commands.todos = todos;
  return commands;
}

/**
 * Prints current version.
 *
 * @api public
 */
commands.version = function() {
  commands.print(require('../package.json').version);
};

/**
 * Lists todo items.
 *
 * @api public
 */
commands.list = function() {
  commands.todos['all'](function(items) {
    commands.print('\n  '+commands.todos.list+': ');
    commands.print(commands.format(items));
  });
};

/**
 * Marks an item as done.
 *
 * @param {String} Number.
 * @api public
 */
commands.check = function(num) {
  commands.todos.check(+num - 1, true);
};

/**
 * Undo a check for item.
 *
 * @param {String} Number.
 * @api public
 */
commands.undo = function(num) {
  commands.todos.check(+num - 1, false);
};

/**
 * Deletes an item.
 *
 * @param {String} Todo item number.
 * @api public
 */
commands.destroy = function(num) {
  commands.todos.destroy(+num - 1);
};

/**
 * Clears the whole todo item.
 *
 * @param {String} Todo item number.
 * @api public
 */
commands.clear = function(num) {
  commands.todos.clear();
};

/**
 * Adds new item to the todo list.
 *
 * @param {String} Item description.
 * @api public
 */
commands.add = function(item) {
  commands.todos.add(item);
};

/**
 * Initialize data dir.
 *
 * @api public
 */
commands.prep = function() {
  var fs = require('fs'),
      path = require('path');
  var _root_ = process.env.HOME,
      dir = path.join(_root_, '.todo');

  (function(dir) {
    var result = false;
    fs.mkdir(dir, 0755, function(err) {
      if (err) {
        console.log('Can not initialize data dir.');
      } else {
        console.log('Data dir ['+dir+'] created.');
      }
    });
  })(dir);
};

/**
 * Prints the todo list to a file.
 *
 * @param {String} File location/name
 * @api public
 */
commands.write = function(filename) {
  filename || (filename = "~/todo.txt");

  commands.todos[app.argv.all ? 'all' : 'undone'](function(items) {
    var data = commands.format(items);

    commands.print(data);

    fs.writeFile(filename, data, 'utf8', function(err, written) {
      if (err) return commands.print(err);
    });
  });
};

var func_table = {
  'check': commands.check,
  'clear': commands.clear,
  'ls': commands.list,
  'rm': commands.destroy,
  'undo': commands.undo,
  'write': commands.write
};

/**
 * Multi list support.
 * Exec todos command with specific list name
 *
 * @param {String} list name
 * @param {String} command
 * @param {String} options
 * @api public
 */
commands.at = function(lname, cmd, opt) {
  commands.todos.at(lname);
  if (!func_table[cmd]) {
    commands.add(cmd + opt);
  } else {
    func_table[cmd](opt);
  }
};
