if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function (require, exports, module) {

  //TODO: Minimize the event handling bug (create sample extension that demonstrates it) and file it

  var NodeConnection = brackets.getModule("utils/NodeConnection");
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

  var domainName = "extension.aivanov.commandline.shortcuts.node";
  var domainPath = ExtensionUtils.getModulePath(module) + "node/run-command.js";

  function CommandLine() {
    this.nodeConnection = null;
    this.listeners = {};
  }

  CommandLine.prototype.init = function() {
    var self = this;
    var nodeConnection = new NodeConnection();
    var originalReceive = nodeConnection._receive;

    this.nodeConnection = nodeConnection;
    this.nodeConnection._receive = function(message) {
      var data = JSON.parse(message.data);

      if (data.type === "event" && data.message.domain === domainName) {
        self._handle(data.message);
      } else {
        originalReceive.call(this, message);
      }
    };
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
    for (var eventName in handlers) {
      if (handlers.hasOwnProperty(eventName)) {
        //Broken after recent upgrade of Brackets, looks like a bug in Brackets
        //this._connectionListen(domainName + ":" + eventName, handlers[eventName]);
        this._connectionListen(eventName, handlers[eventName]);
      }
    }
  };

  CommandLine.prototype._connectionListen = function(eventName, handler) {
    //Broken after recent upgrade of Brackets, looks like a bug in Brackets
    //this.nodeConnection.on(eventName, handler);
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(handler);
  };

  //Workaround for the broken event listening code in Brackets: implementing it in the extension
  CommandLine.prototype._handle = function(message) {
    var eventName = message.event;
    var eventData = message.parameters;

    this.listeners[eventName].forEach(function(listener) {
      listener(eventName, eventData);
    });
  };

  CommandLine.prototype.closeConnection = function() {
    this.nodeConnection.disconnect();
  };

  exports.CommandLine = CommandLine;
});
