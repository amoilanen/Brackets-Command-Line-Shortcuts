require('./BracketsStubs.js');
require('should');
var sinon = require('sinon');

var RunManager = require('../src/RunManager.js').RunManager;

describe('RunManager', function() {

  var panel;
  var configurationEntry;
  var runManager;

  beforeEach(function() {
    panel = {
      hide: function() {}
    };
    configurationEntry = {};
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

    var runnable;

    beforeEach(function() {
      runnable = sinon.spy();
    });

    it('should run runnable', function() {
      runManager.start(configurationEntry, runnable);
      runnable.calledOnce.should.be.equal(true);
    });

    it('should remember autohide on start', function() {
      runManager.autohide.should.be.equal(false);
      configurationEntry.autohide = true;
      runManager.start(configurationEntry, runnable);
      runManager.autohide.should.be.equal(true);
    });

    it('should assume autohide to be "false" by default', function() {
      runManager.autohide = true;
      runManager.start(configurationEntry, runnable);
      runManager.autohide.should.be.equal(false);
    });

    describe('sequence of starts', function() {

      var otherRunnable;

      beforeEach(function() {
        otherRunnable = sinon.spy();
      });

      it('should not run next runnable if not yet finished', function() {
        runManager.start(configurationEntry, runnable);
        runManager.start(configurationEntry, otherRunnable);
        runnable.calledOnce.should.be.equal(true);
        otherRunnable.calledOnce.should.be.equal(false);
      });

      it('should allow to run next runnable when finished', function() {
        runManager.start(configurationEntry, runnable);
        runManager.finish();
        runManager.start(configurationEntry, otherRunnable);
        runnable.calledOnce.should.be.equal(true);
        otherRunnable.calledOnce.should.be.equal(true);
      });
    });
  });

  describe('finish', function() {

    describe('panel hiding', function() {

      it('should hide the panel if autohide is set', function(done) {
        panel.hide = function() {
          done();
        };
        runManager.autohide = true;
        runManager.finish();
      });

      it('should not hide the panel if autohide is not set', function(done) {
        panel.hide = sinon.spy();
        runManager.autohide = false;
        runManager.finish();
        setTimeout(function() {
          panel.hide.calledOnce.should.be.equal(false);
          done();
        }, RunManager.PANEL_AUTOHIDE_TIMEOUT_MS * 2);
      });
    });

    it('should reset autohide to "false"', function() {
      runManager.autohide = true;
      runManager.finish();
      runManager.autohide.should.be.equal(false);
    });

    it('should reset running to "false"', function() {
      runManager.running = true;
      runManager.finish();
      runManager.running.should.be.equal(false);
    });
  });
});
