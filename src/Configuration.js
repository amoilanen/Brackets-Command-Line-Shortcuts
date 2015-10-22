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

  var ALLOWED_FIELDS = ['name', 'cmd', 'dir', 'shortcut'];
  var MANDATORY_FIELDS = ['name', 'cmd', 'dir', 'shortcut'];

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
    this.getConfiguredCommands().forEach(function(entry, idx) {
      var commandId = 'extension.commandline.run.' + idx;

      Object.keys(entry).forEach(function(entryFieldName) {
        if (ALLOWED_FIELDS.indexOf(entryFieldName) < 0) {
          console.warn('Ignoring unknown configuration field "' + entryFieldName + '":',
                       Util.toPrettyString(entry));
        }
      });

      var isWellFormedEntry = MANDATORY_FIELDS.every(function(mandatoryFieldName) {
        var fieldValue = entry[mandatoryFieldName];
        var isFieldWellFormed = fieldValue && (fieldValue.length > 0);

        if (!isFieldWellFormed) {
          console.warn('Missing configuration field "' + mandatoryFieldName +  '", ignoring entry:',
                       Util.toPrettyString(entry));
        }
        return isFieldWellFormed;
      });

      if (!isWellFormedEntry) {
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
