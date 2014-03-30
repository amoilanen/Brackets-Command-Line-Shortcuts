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
    }
  };
});