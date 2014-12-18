require('./BracketsStubs.js');
require('should');
var sinon = require('sinon');

var CommandLine = require('../src/CommandLine.js').CommandLine;

describe('CommandLine', function() {

  var commandLine;
  var connectionListenStub;

  function handler1() {
  }

  function handler2() {
  }

  function handler3() {
  }

  beforeEach(function() {
    commandLine = new CommandLine();
    connectionListenStub = sinon.stub(commandLine, '_connectionListen');
  });

  afterEach(function() {
    connectionListenStub.restore();
  });

  it('should register multiple listeners properly', function() {
    commandLine.addListeners({
      'event1': handler1,
      'event2': handler2,
      'event3': handler3
    });
    connectionListenStub.getCalls().map(function(call) { return call.args; }).should.be.eql([
      ['extension.commandline.node.event1', handler1],
      ['extension.commandline.node.event2', handler2],
      ['extension.commandline.node.event3', handler3]
    ]);
  });

  it('should not register any listeners if handlers is an empty object', function() {
    commandLine.addListeners({});

    connectionListenStub.getCalls().length.should.be.equal(0);
  });

  it('should not register any listeners if handlers is an empty array', function() {
    commandLine.addListeners([]);

    connectionListenStub.getCalls().length.should.be.equal(0);
  });

  it('should register all listeners when called in sequence', function() {
    commandLine.addListeners({
      'event1': handler1
    });
    commandLine.addListeners({
      'event2': handler2
    });
    commandLine.addListeners({
      'event3': handler3
    });

    connectionListenStub.getCalls().map(function(call) { return call.args; }).should.be.eql([
      ['extension.commandline.node.event1', handler1],
      ['extension.commandline.node.event2', handler2],
      ['extension.commandline.node.event3', handler3]
    ]);
  });

  it('should not register any listeners if handlers is null or undefined', function() {
    commandLine.addListeners(null);
    commandLine.addListeners(undefined);

    connectionListenStub.getCalls().length.should.be.equal(0);
  });
});
