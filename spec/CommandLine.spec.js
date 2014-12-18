require('./BracketsStubs.js');
require('should');
var sinon = require('sinon');

var CommandLine = require('../src/CommandLine.js').CommandLine;

describe('CommandLine', function() {

  var commandLine;
  var connectionListenStub;

  beforeEach(function() {
    commandLine = new CommandLine();
    connectionListenStub = sinon.stub(commandLine, '_connectionListen');
  });

  afterEach(function() {
    connectionListenStub.restore();
  });

  it('should register multiple listeners properly', function() {
    function handler1() {
    }
    function handler2() {
    }
    function handler3() {
    }

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
});
