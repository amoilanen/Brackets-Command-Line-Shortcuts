define(function (require, exports, module) {

  var PANEL_AUTOHIDE_TIMEOUT_MS = 500;

  function RunManager(panel) {
    this.panel = panel;
    this.autohide = false;
    this.running = false;
  }

  RunManager.prototype.start = function(configurationEntry, runnable) {
    if (this.running) {
        return;
    }
    this.running = true;
    this.autohide = configurationEntry.autohide || false;

    runnable && runnable();
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
  }

  exports.RunManager = RunManager;
});