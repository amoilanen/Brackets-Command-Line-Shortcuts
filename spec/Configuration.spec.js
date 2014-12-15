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
});