require('./BracketsStubs.js');
require('should');
var sinon = require('sinon');

var Util = require('../src/Util.js').Util;

describe('Util', function() {

  describe('encodeSpecialCharacters', function() {

    [
      ['&', '&amp;'],
      ['>', '&gt;'],
      ['<', '&lt;'],
      ['"', '&quot;'],
      ['\'', '&#039;']
    ].forEach(function(fixture) {
      var symbol = fixture[0];
      var encodedSymbol = fixture[1];

      it('should encode \'' + symbol + '\' as \'' + encodedSymbol + '\'', function() {
        Util.encodeSpecialCharacters(symbol).should.be.equal(encodedSymbol);
      });
    });
  });

  describe('formatTime', function() {

    it('should format time', function() {
      var time = {
        getSeconds: sinon.stub().returns(11),
        getMinutes: sinon.stub().returns(35),
        getHours: sinon.stub().returns(23)
      };

      Util.formatTime(time).should.be.equal('23:35:11');
      for (var spy in time) {
        time[spy].calledOnce.should.be.equal(true);
      }
    });
  });

  describe('stripTrailingPathSeparator', function() {

    it('should strip trailing Unix separator', function() {
      Util.stripTrailingPathSeparator('/home/user/src/').should.be.equal('/home/user/src');
    });

    it('should strip trailing Windows separator', function() {
      Util.stripTrailingPathSeparator('D:\\\\User\\Src\\').should.be.equal('D:\\\\User\\Src');
    });

    it('should leave original path unchaged if no trailing separator', function() {
      Util.stripTrailingPathSeparator('/home/user/src').should.be.equal('/home/user/src');
    });
  });

});