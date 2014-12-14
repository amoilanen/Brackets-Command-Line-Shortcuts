require('./BracketsStubs.js');
require('should');
var sinon = require('sinon');

var Configuration = require('../src/Configuration.js').Configuration;

describe('Configuration', function() {

  var configuration = null;

  beforeEach(function() {
    configuration = new Configuration();
  });

  //TODO: What if some variables are not defined? Test this
  describe('expand variables', function() {
    var selectedItem;
    var projectRoot;
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
        var expanded = configuration.expandVariables({
          dir: '$PROJECT_ROOT',
          shortcut: 'shortcut',
          cmd: 'cmd',
          name: 'name',
          autohide: false
        });

        expanded.dir.should.be.exactly('root');
      });

      //TODO: Test case when nothing to expand
    });
  });
});