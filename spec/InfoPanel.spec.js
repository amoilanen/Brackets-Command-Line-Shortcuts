require('./BracketsStubs.js');
require('should');
var sinon = require('sinon');

var InfoPanel = require('../src/InfoPanel.js').InfoPanel;

describe('InfoPanel', function() {

  var infoPanel;

  beforeEach(function() {
    infoPanel = new InfoPanel();
  });

  it('should wrap one line into a div', function() {
    infoPanel.formatAsHtml('message1').should.be.equal('<div>message1</div>');
  });

  it('should replace Unix line end symbols with line break', function() {
    infoPanel.formatAsHtml('\n').should.be.equal('<div><br/></div>');
  });

  it('should replace Windows line end symbols with line break', function() {
    infoPanel.formatAsHtml('\r\n').should.be.equal('<div><br/></div>');
  });
});
