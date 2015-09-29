if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function (require, exports, module) {

  var CommandManager = brackets.getModule('command/CommandManager');
  var Commands = brackets.getModule('command/Commands');
  var FileUtils = brackets.getModule("file/FileUtils");
  var Menus = brackets.getModule("command/Menus");
  var KeyBindingManager = brackets.getModule("command/KeyBindingManager");
  var ProjectManager = brackets.getModule('project/ProjectManager');

  var Util = require("./Util").Util;

  var CONFIGURE_COMMAND_LINE_COMMAND_ID = "extension.commandline.configure.id";

  // Use PreferencesManager to save commands.
  var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
  var prefs = PreferencesManager.getExtensionPrefs("command-line-shortcuts");
  var initial = [
    {
      "name": "Build current project with Grunt",
      "dir": "$PROJECT_ROOT",
      "cmd": "grunt",
      "shortcut": "Ctrl-Alt-B"
    },
    {
      "name": "Update source from git",
      "dir": "$PROJECT_ROOT",
      "cmd": "git pull",
      "shortcut": "Ctrl-Shift-G"
    },
    {
      "name": "List all top level files in the project directory",
      "dir": "$PROJECT_ROOT",
      "cmd": "ls",
      "shortcut": "Ctrl-Shift-L"
    },
    {
      "name": "Display contents of the currently selected file",
      "dir": "$SELECTED_ITEM_DIR",
      "cmd": "cat $SELECTED_ITEM",
      "shortcut": "Ctrl-Alt-C"
    }
  ];

  // FIXME: Is "general" the correct type?
  prefs.definePreference("commands", "general", undefined);

  if (!prefs.get("commands")) {
    prefs.set("commands", initial);
  }

  function Configuration() {
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

  Configuration.prototype.getConfigurationObject = function() {
    return prefs.get("commands");
  };

  Configuration.prototype.read = function(entryCallback) {
    var configuration = this.getConfigurationObject();

    configuration.forEach(function(entry, idx) {
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
