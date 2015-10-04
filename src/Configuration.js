if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function (require, exports, module) {

  var CommandManager = brackets.getModule('command/CommandManager');
  var Commands = brackets.getModule('command/Commands');
  var FileUtils = brackets.getModule("file/FileUtils");
  var Menus = brackets.getModule("command/Menus");
  var KeyBindingManager = brackets.getModule("command/KeyBindingManager");
  var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
  var ProjectManager = brackets.getModule('project/ProjectManager');

  var Util = require("./Util").Util;

  var CONFIGURE_COMMAND_LINE_COMMAND_ID = "extension.commandline.configure.id";

  function Configuration() {
    this.preferences = null;
  }

  Configuration.prototype.init = function() {
    this.preferences = PreferencesManager.getExtensionPrefs("command-line-shortcuts");
    this.preferences.definePreference("commands", "general");
    if (!this.preferences.get("commands")) {
      this.preferences.set("commands", JSON.parse(require('text!initial.preferences.json')));
    }
  }

  Configuration.prototype.expandVariables = function(entry) {
    if (!entry) {
      return entry;
    }

    var self = this;
    var selectedItem = ProjectManager.getSelectedItem();

    var selectedItemPath = Util.stripTrailingPathSeparator(selectedItem._path);
    var selectedItemDir = Util.stripTrailingPathSeparator(selectedItem._parentPath);
    var projectRoot = Util.stripTrailingPathSeparator(ProjectManager.getProjectRoot().fullPath);

    var expandedEntry = JSON.parse(JSON.stringify(entry));
    ['dir', 'cmd'].forEach(function(fieldName) {
      if (typeof expandedEntry[fieldName] === 'undefined') {
        return;
      }

      expandedEntry[fieldName] = entry[fieldName].replace(/\$PROJECT_ROOT/g, projectRoot)
          .replace(/\$SELECTED_ITEM_DIR/g, selectedItemDir)
          .replace(/\$SELECTED_ITEM/g, selectedItemPath);
    });
    return expandedEntry;
  };

  Configuration.prototype.getConfiguredCommands = function() {
    return this.preferences.get("commands");
  };

  Configuration.prototype.read = function(entryCallback) {
    var configuredCommands = this.getConfiguredCommands();

    configuredCommands.forEach(function(entry, idx) {
      var commandId = 'extension.commandline.run.' + idx;
      var wellFormedEntry = ['name', 'cmd', 'dir', 'shortcut'].every(function(fieldName) {
        return entry[fieldName] && entry[fieldName].length > 0;
      });

      if (!wellFormedEntry) {
        return;
      }

      CommandManager.register(
        entry.name,
        commandId,
        entryCallback(entry)
      );
      KeyBindingManager.addBinding(commandId, entry.shortcut);
    });
  };

  exports.Configuration = Configuration;
});
