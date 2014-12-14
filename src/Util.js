if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function (require, exports) {

  function formatNumber(number) {
    return number > 9 ? number.toString() : "0" + number;
  }

  exports.Util = {
    encodeSpecialCharacters: function(str) {
      return str.replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    formatTime: function(time) {
      return formatNumber(time.getHours()) +
        ":" + formatNumber(time.getMinutes()) +
        ":" + formatNumber(time.getSeconds());
    },
    stripTrailingPathSeparator: function(path) {
      var lastCharacter = path[path.length - 1];

      return ((lastCharacter == "/") || (lastCharacter == "\\")) ? path.slice(0, -1) : path;
    }
  };
});