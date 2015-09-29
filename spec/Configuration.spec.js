require('./BracketsStubs.js');
require('should');
var sinon = require('sinon');

var Configuration = require('../src/Configuration.js').Configuration;

describe('Configuration', function() {

  var configuration = null;

  beforeEach(function() {
    configuration = new Configuration();
  });

  describe('expand variables', function() {
    var selectedItem;
    var projectRoot;
    var entry;
    var getSelectedItemStub;
    var getProjectRootStub;

    beforeEach(function() {
      selectedItem = {
        _path: '',
        _parentPath: ''
      };
      projectRoot = {
        fullPath: ''
      };
      entry = {
        dir: 'dir',
        shortcut: 'shortcut',
        cmd: 'cmd',
        name: 'name',
        autohide: false
      };

      var ProjectManager = brackets.getModule('project/ProjectManager');

      getSelectedItemStub = sinon.stub(ProjectManager, 'getSelectedItem',function() {
        return selectedItem;
      });
      getProjectRootStub = sinon.stub(ProjectManager, 'getProjectRoot',function() {
        return projectRoot;
      });
    });

    afterEach(function() {
      getSelectedItemStub.restore();
      getProjectRootStub.restore();
    });

    describe('entry.dir', function() {

      it('should expand project root', function() {
        projectRoot.fullPath = 'root';
        entry.dir = '$PROJECT_ROOT';
        configuration.expandVariables(entry).dir.should.be.exactly('root');
      });

      it('should expand current directory', function() {
        selectedItem._parentPath = 'mydir';
        entry.dir = '$SELECTED_ITEM_DIR';
        configuration.expandVariables(entry).dir.should.be.exactly('mydir');
      });

      it('should not expand if no variables', function() {
        entry.dir = 'dir';
        configuration.expandVariables(entry).dir.should.be.exactly('dir');
      });
    });

    describe('entry.cmd', function() {

      it('should expand project root', function() {
        projectRoot.fullPath = 'root';
        entry.cmd = 'ls $PROJECT_ROOT';
        configuration.expandVariables(entry).cmd.should.be.exactly('ls root');
      });

      it('should expand current directory', function() {
        selectedItem._parentPath = 'mydir';
        entry.cmd = 'rm -rf $SELECTED_ITEM_DIR';
        configuration.expandVariables(entry).cmd.should.be.exactly('rm -rf mydir');
      });

      it('should not expand if no variables', function() {
        entry.cmd = 'echo test';
        configuration.expandVariables(entry).cmd.should.be.exactly('echo test');
      });
    });

    it('should not expand not defined variables', function() {
      entry.cmd = 'cat $VARIABLE_1';
      entry.dir = '$VARIABLE_2';

      var expandedEntry = configuration.expandVariables(entry);

      expandedEntry.cmd.should.be.exactly('cat $VARIABLE_1');
      expandedEntry.dir.should.be.exactly('$VARIABLE_2');
    });

    it('should not raise errors if entry fields are not defined', function() {
      entry = {};
      configuration.expandVariables(entry).should.be.eql(entry);
    });

    it('should not raise errors if entry is null', function() {
      entry = null;
      (configuration.expandVariables(entry) === entry).should.be.equal(true);
    });
  });

  describe('read configuration', function() {

    var configurationObject;
    var getConfiguredCommandsStub;
    var keyBindingManagerSpy;
    var registerSpy;

    function readEntry(entry) {
      var idx = configurationObject.indexOf(entry);

      return 'callback.value.' + idx;
    }

    beforeEach(function() {
      var KeyBindingManager = brackets.getModule('command/KeyBindingManager');
      var CommandManager = brackets.getModule('command/CommandManager');

      configurationObject = [
        {
          name: 'name0',
          cmd: 'cmd0',
          dir: 'dir0',
          shortcut: 'shortcut0',
          autohide: 'autohide0'
        },
        {
          name: 'name1',
          cmd: 'cmd1',
          dir: 'dir1',
          shortcut: 'shortcut1',
          autohide: 'autohide1'
        },
        {
          name: 'name2',
          cmd: 'cmd2',
          dir: 'dir2',
          shortcut: 'shortcut2',
          autohide: 'autohide2'
        }
      ];
      getConfiguredCommandsStub = sinon.stub(configuration, 'getConfiguredCommands', function() {
        return configurationObject;
      });
      keyBindingManagerSpy = sinon.spy(KeyBindingManager, 'addBinding');
      registerSpy = sinon.spy(CommandManager, 'register');
    });

    afterEach(function() {
      getConfiguredCommandsStub.restore();
      keyBindingManagerSpy.restore();
      registerSpy.restore();
    });

    it('should read full configuration', function() {
      configuration.read(readEntry);

      keyBindingManagerSpy.getCalls().map(function(call) { return call.args; }).should.be.eql([
        ['extension.commandline.run.0', 'shortcut0'],
        ['extension.commandline.run.1', 'shortcut1'],
        ['extension.commandline.run.2', 'shortcut2']
      ]);
      registerSpy.getCalls().map(function(call) { return call.args; }).should.be.eql([
        ['name0', 'extension.commandline.run.0', 'callback.value.0'],
        ['name1', 'extension.commandline.run.1', 'callback.value.1'],
        ['name2', 'extension.commandline.run.2', 'callback.value.2']
      ]);
    });

    describe('malformed configuration entries', function() {

      it('should ignore extra field', function() {
        configurationObject = [
          {
            name: 'name0',
            cmd: 'cmd0',
            dir: 'dir0',
            shortcut: 'shortcut0',
            unknown_field: 'some_unknown_value'
          }
        ];

        configuration.read(readEntry);

        keyBindingManagerSpy.getCalls()
          .map(function(call) { return call.args; }).should.be.eql([
            ['extension.commandline.run.0', 'shortcut0']
          ]);
        registerSpy.getCalls()
          .map(function(call) { return call.args; }).should.be.eql([
            ['name0', 'extension.commandline.run.0', 'callback.value.0']
          ]);
      });

      it('should ignore entry with missing name', function() {
        configurationObject = [
          {
            cmd: 'cmd0',
            dir: 'dir0',
            shortcut: 'shortcut0'
          }
        ];

        configuration.read(readEntry);

        keyBindingManagerSpy.getCalls().length.should.be.equal(0);
        registerSpy.getCalls().length.should.be.equal(0);
      });

      it('should ignore entry with missing cmd', function() {
        configurationObject = [
          {
            name: 'name0',
            dir: 'dir0',
            shortcut: 'shortcut0'
          }
        ];

        configuration.read(readEntry);

        keyBindingManagerSpy.getCalls().length.should.be.equal(0);
        registerSpy.getCalls().length.should.be.equal(0);
      });

      it('should ignore entry with missing dir', function() {
        configurationObject = [
          {
            name: 'name0',
            cmd: 'cmd0',
            shortcut: 'shortcut0'
          }
        ];

        configuration.read(readEntry);

        keyBindingManagerSpy.getCalls().length.should.be.equal(0);
        registerSpy.getCalls().length.should.be.equal(0);
      });

      it('should ignore entry with missing shortcut', function() {
        configurationObject = [
          {
            name: 'name0',
            cmd: 'cmd0',
            dir: 'dir0'
          }
        ];

        configuration.read(readEntry);

        keyBindingManagerSpy.getCalls().length.should.be.equal(0);
        registerSpy.getCalls().length.should.be.equal(0);
      });
    });
  });
});
