Command Line Shortcuts for Brackets
===============================

Brackets IDE plugin. Adds support of shortcuts for execution of terminal commands right from the IDE.

## Configure Shortcuts

Activate the menu item `Edit -> Command Line Shortcuts` or use the keyboard shortcut `Ctrl-Shift-Q` to open the configuration of shortcuts for the plugin.

Example configuration

```
[
  {
    "name": "Build whole project",
    "dir": "$PROJECT_ROOT",
    "cmd": "grunt",
    "shortcut": "Ctrl-Shift-B",
    "autohide": true
  },
  {
    "name": "Run unit tests",
    "dir": "$PROJECT_ROOT",
    "cmd": "grunt test",
    "shortcut": "Ctrl-Alt-B",
    "autohide": true
  },
  {
    "name": "Update the source",
    "dir": "$PROJECT_ROOT",
    "cmd": "git pull",
    "shortcut": "Ctrl-Shift-P",
    "autohide": true
  },
  {
    "name": "Display contents of the currently selected file",
    "dir": "$SELECTED_ITEM_DIR",
    "cmd": "cat $SELECTED_ITEM",
    "shortcut": "Ctrl-Alt-C"
  }
]
```

* `name` name of the configuration entry, optional
* `dir` specifies the directory in which the command should be run, required
* `cmd` the actual command, required
* `shortcut` the keyboard shortcut that will activate the command, required
* `autohide` whether the feedback panel with the command output should be hidden automatically, optional

`$PROJECT_ROOT` is a special variable that denotes the root directory of the currently open project. This way when opening multiple projects in a sequence the shortcuts will be applicable for each project provided that the configured commands can be run in the root of each open project.

In order for changes to be applied just reload Brackets.

### Supported variables

The following variables can be used in the configuration as values for `dir` and `cmd`:

* `$PROJECT_ROOT` root directory of the current project
* `$SELECTED_ITEM` path to the file currently selected in the project
* `$PROJECT_ITEM_DIR` path to the parent directory of the file currently selected in the project

## Use shortcuts

After re-loading Brackets with the latest version of the configuration just use the shortcuts. In the example above

`Ctrl-Shift-B` will build the project and `Ctrl-Shift-P` will fetch the latest sources from its Git repository.

## Supported platforms

The plugin has been tested on Windows 8 and Ubuntu Linux.

## Report issues

Issues can be reported at [https://github.com/antivanov/Brackets-Command-Line-Shortcuts/issues](https://github.com/antivanov/Brackets-Command-Line-Shortcuts/issues)

## License

MIT License
(c) [Anton Ivanov](http://smthngsmwhr.wordpress.com/)

Credits
---------------

The plugin was in part inspired by [Brackets Builder](https://github.com/Vhornets/brackets-builder)
