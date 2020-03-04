/*!
 * helper-timeago <https://github.com/jonschlinkert/helper-timeago>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function timeago(date) {
  var secs = seconds(date);
  var res, span, i = 0;

  if (secs >= 86400 && secs <= 86400 * 2) {
    return 'Вчера';
  }

  while (span = exports.timespan[i++]) {
    res = calculate(span, secs, i);
    if (res) {
      return res;
    }
  }

  if (Math.floor(secs) === 0) {
    return 'Только что';
  } else {
    return Math.floor(secs) + ' секунд назад';
  }
};

exports.timespan = [
  [31536000, Infinity, ' г.'],
  [2592000, 12, ' мес.'],
  [86400, 28, ' дн.'],
  [3600, 24, ' час.'],
  [60, 60, ' мин.']
];

function calculate(span, secs, i) {
  var res = Math.floor(secs / span[0]);
  if (res > 1) {
    if (res > span[1]) {
      return '1' + exports.timespan[i-2][2] + ' назад';
    }
    return res + span[2] + ' назад';
  }
}

function seconds(time) {
  return Math.floor((new Date() - new Date(time)) / 1000);
}
