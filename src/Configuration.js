if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function (require, exports, module) {

  var CommandManager = brackets.getModule('command/CommandManager');
  var Commands = brackets.getModule('command/Commands');
  var FileUtils = brackets.getModule("file/FileUtils");
//  var CommandManager = brackets.getModule("command/CommandManager");
  var Menus = brackets.getModule("command/Menus");
  var KeyBindingManager = brackets.getModule("command/KeyBindingManager");
  var ProjectManager = brackets.getModule('project/ProjectManager');

  var Util = require("./Util").Util;

  var CONFIGURE_COMMAND_LINE_COMMAND_ID = "extension.commandline.configure.id";

  function addMenuItem() {
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);

    CommandManager.register(
      "Command Line Shortcuts",
      CONFIGURE_COMMAND_LINE_COMMAND_ID, function() {
        // TODO: Move config file out of extension folder
        var src = FileUtils.getNativeModuleDirectoryPath(module) + "/brackets-commandline.0.2.2.json";

        CommandManager.execute(Commands.CMD_OPEN, {fullPath: src});
    });
    menu.addMenuItem(CONFIGURE_COMMAND_LINE_COMMAND_ID, 'Ctrl-Shift-Q');
  }

  addMenuItem();

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
    // TODO: Move config file out of extension folder
    return JSON.parse(require('text!brackets-commandline.0.2.2.json'));
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
