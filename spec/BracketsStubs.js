var FileUtils = {};
var CommandManager = {
  register: function() {
  }
};
var Commands = {};
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
var PreferencesManager = {
  getExtensionPrefs: function(){
    var storage = {};

    return {
      definePreference: function(key, type, value){
        storage[key] = value;
      },
      get: function(key){
        return storage[key];
      },
      set: function(key, value){
        storage[key] = value;
      }
    };
  }
};

var modules = {
  'file/FileUtils': FileUtils,
  'command/CommandManager': CommandManager,
  'command/Commands': Commands,
  'command/Menus': Menus,
  'command/KeyBindingManager': KeyBindingManager,
  'project/ProjectManager': ProjectManager,
  'utils/ExtensionUtils': ExtensionUtils,
  'preferences/PreferencesManager': PreferencesManager
};

brackets = {
  getModule: function(moduleName) {
    return modules[moduleName];
  }
};
