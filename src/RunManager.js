if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function (require, exports, module) {

  var PANEL_AUTOHIDE_TIMEOUT_MS = 500;

  function RunManager(panel) {
    this.panel = panel;
    this.autohide = false;
    this.running = false;
  }

  RunManager.PANEL_AUTOHIDE_TIMEOUT_MS = PANEL_AUTOHIDE_TIMEOUT_MS;

  RunManager.prototype.start = function(configurationEntry, runnable) {
    if (this.running) {
      return;
    }
    this.running = true;
    this.autohide = configurationEntry.autohide || false;

    runnable && runnable(); //jshint ignore:line
  };

  RunManager.prototype.finish = function() {
    var self = this;

    if (this.autohide) {
      setTimeout(function() {
        self.panel.hide();
      }, PANEL_AUTOHIDE_TIMEOUT_MS);
    }
    this.running = false;
    this.autohide = false;
  };

  exports.RunManager = RunManager;
});