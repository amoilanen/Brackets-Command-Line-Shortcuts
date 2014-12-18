var DocumentManager = {};
var FileUtils = {};
var CommandManager = {
  register: function() {
  }
};
var Menus = {
  AppMenuBar: {
    EDIT_MENU: 0
  },
  getMenu: function() {
    return {
      addMenuItem: function() {
      }
    };
  }
};
var KeyBindingManager = {
  addBinding: function() {}
};
var ProjectManager = {
  getSelectedItem: function() {},
  getProjectRoot: function() {}
};
var ExtensionUtils = {
  getModulePath: function() {return '';}
};

var modules = {
  'document/DocumentManager': DocumentManager,
  'file/FileUtils': FileUtils,
  'command/CommandManager': CommandManager,
  'command/Menus': Menus,
  'command/KeyBindingManager': KeyBindingManager,
  'project/ProjectManager': ProjectManager,
  'utils/ExtensionUtils': ExtensionUtils
};

brackets = {
  getModule: function(moduleName) {
    return modules[moduleName];
  }
};
