define(function (require, exports, module) {

  var DocumentManager = brackets.getModule("document/DocumentManager");
  var FileUtils = brackets.getModule("file/FileUtils");
  var CommandManager = brackets.getModule("command/CommandManager");
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
        var src = FileUtils.getNativeModuleDirectoryPath(module) + "/brackets-commandline.0.2.1.json";

      DocumentManager.getDocumentForPath(src).done(
        function (doc) {
          DocumentManager.setCurrentDocument(doc);
        }
      );
    });
    menu.addMenuItem(CONFIGURE_COMMAND_LINE_COMMAND_ID, 'Ctrl-Shift-Q');
  }

  addMenuItem();

  function Configuration() {
  }

  Configuration.prototype.expandVariables = function(entry) {
    var self = this;
    var selectedItem = ProjectManager.getSelectedItem();

    var selectedItemPath = Util.stripTrailingPathSeparator(selectedItem._path);
    var selectedItemDir = Util.stripTrailingPathSeparator(selectedItem._parentPath);
    var projectRoot = Util.stripTrailingPathSeparator(ProjectManager.getProjectRoot().fullPath);

    var expandedEntry = JSON.parse(JSON.stringify(entry));
    ['dir', 'cmd'].forEach(function(fieldName) {
      expandedEntry[fieldName] = entry[fieldName].replace(/\$PROJECT_ROOT/g, projectRoot)
          .replace(/\$SELECTED_ITEM_DIR/g, selectedItemDir)
          .replace(/\$SELECTED_ITEM/g, selectedItemPath);
    });
    return expandedEntry;
  };

  Configuration.prototype.read = function(entryCallback) {
    var configuration = JSON.parse(require('text!brackets-commandline.0.2.1.json'));

    configuration.forEach(function(entry, idx) {
      var commandId = 'extension.commandline.run.' + idx;

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