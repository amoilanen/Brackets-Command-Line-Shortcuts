define(function (require, exports, module) {

  var NodeConnection = brackets.getModule("utils/NodeConnection");
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

  var domainName = "extension.commandline.node";
  var domainPath = ExtensionUtils.getModulePath(module) + "node/run-command.js";

  function listenOn(connection, handlers) {
    for (var eventName in handlers) {
      if (handlers.hasOwnProperty(eventName)) {
        $(connection).on(domainName + "." + eventName, handlers[eventName]);
      }
    }
  }

  function CommandLine() {
    this.nodeConnection = null;
  }

  CommandLine.prototype.init = function() {
    this.nodeConnection = new NodeConnection();
  };

  CommandLine.prototype.run = function(dir, cmd, onStartCallback) {
    var self = this;

    this.nodeConnection.connect(true).fail(function (err) {
      console.error("Cannot connect to node: ", err);
    }).then(function() {
      self.nodeConnection.loadDomains([domainPath], true).fail(function (err) {
        console.error("Cannot load domain", err);
      }).then(function() {
        self.nodeConnection.domains[domainName].runCmd(dir, cmd);
        onStartCallback && onStartCallback(); //jshint ignore:line
      });
    });
  };

  CommandLine.prototype.addListeners = function(handlers) {
    listenOn(this.nodeConnection, handlers);
  };

  CommandLine.prototype.closeConnection = function() {
    this.nodeConnection.disconnect();
  };

  exports.CommandLine = CommandLine;
});