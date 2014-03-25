define(function (require, exports) {

  exports.Util = {
    encodeSpecialCharacters: function(str) {
      return str.replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    formatTime: function(time) {
      return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    }
  };
});