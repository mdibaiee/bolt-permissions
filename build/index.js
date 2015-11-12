'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var DEFAULTS = {
  grant: ['admin'],
  deny: ['admin']
};

exports['default'] = function (bot) {
  var data = bot.data;
  var groups = data.permissions;

  bot.modifiers.middleware('listen', function (context) {
    if (context.permissions) {
      var _ret = (function () {
        var user = bot.find(context.user);

        if (Array.isArray(context.permissions)) {
          var access = context.permissions.some(function (permission) {
            var allowed = groups[permission] || [];

            return allowed.includes(user.name);
          });

          if (!access) return {
              v: Promise.reject()
            };
        } else {
          var allowed = groups[context.permissions] || [];

          if (!allowed.includes(user.name)) {
            return {
              v: Promise.reject()
            };
          }
        }
      })();

      if (typeof _ret === 'object') return _ret.v;
    }

    return Promise.resolve();
  });

  var options = _extends({}, DEFAULTS, data.permissions.options);
  var grant = options.grant;

  if (grant) {
    bot.listen(/grant (\w+) (\w+)/i, function (message) {
      var _message$match = _slicedToArray(message.match, 3);

      var user = _message$match[1];
      var group = _message$match[2];

      if (!user || !group) {
        return message.reply('grant <username> <group>');
      }

      if (groups[group]) {
        if (groups[group].indexOf(user) > -1) {
          return message.reply('User ' + user + ' is already in ' + group);
        }

        groups[group].push(user);
      } else {
        groups[group] = [user];
      }

      message.reply('Added ' + user + ' to ' + group);
      console.log(groups);
    }, { permissions: grant });
  }

  var deny = options.deny;
  if (deny) {
    bot.listen(/deny (\w+) (\w+)/i, function (message) {
      var _message$match2 = _slicedToArray(message.match, 3);

      var user = _message$match2[1];
      var group = _message$match2[2];

      if (!user || !group) {
        return message.reply('deny <username> <group>');
      }

      if (!groups[group]) return message.reply('Group ' + group + ' doesn\'t exist');

      var index = groups[group].indexOf(user);
      groups[group].splice(index, 1);

      message.reply('Removed ' + user + ' from ' + group);
    }, { permissions: deny });
  }

  bot.help('grant', 'grant permission groups to users', 'grant <username> <group>');
  bot.help('deny', 'deny permission groups from users', 'deny <username> <group>');
};

module.exports = exports['default'];