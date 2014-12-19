require('./BracketsStubs.js');
require('should');
var sinon = require('sinon');

var RunManager = require('../src/RunManager.js').RunManager;

describe('RunManager', function() {

  var panel;
  var runManager;

  beforeEach(function() {
    panel = {
      hide: function() {
      }
    };
    runManager = new RunManager(panel);
  });

  it('should set panel', function() {
    runManager.panel.should.be.equal(panel);
  });

  it('should have autohide set to "false" by default', function() {
    runManager.autohide.should.be.equal(false);
  });

  it('should have running set to "false" by default', function() {
    runManager.running.should.be.equal(false);
  });

  describe('start', function() {

    it('should run runnable', function() {
      //TODO:
    });

    xit('should remember autohide on start', function() {
      //TODO:
    });

    xit('should reset autohide to "false" by default', function() {
      //TODO:
    });

    xit('should not run next runnable if not yet finished', function() {
      //TODO:
    });

    xit('should allow to run next runnable when finished', function() {
      //TODO:
    });

    xit('should allow to run next runnable when finished', function() {
      //TODO:
    });
  });

  describe('finish', function() {

    xit('should hide the panel if autohide is set', function() {
      //TODO: Asynchronous
    });

    xit('should not hide the panel if autohide is not set', function() {
      //TODO: Asynchronous
    });

    xit('should reset autohide to "false"', function() {
      //TODO:
    });

    xit('should reset running to "false"', function() {
      //TODO:
    });
  });
});
