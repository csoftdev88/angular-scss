'use strict';

describe('i18nCurrency', function() {
  var _checkInDateFilter, _clock;

  beforeEach(function() {
    module('mobiusApp.filters.checkInDate', function($provide) {
      var Settings = {
        'UI': {
          'checkInDateFormats': {
            'defaultFormat': 'YYYY MM DD',
            'rules': [
              {
                max: 8 * 86400000,
                // Only future dates
                min: 0,
                format: 'dd'
              },
              {
                min: 8 * 86400000,
                max: 90 * 86400000,
                format: 'DD MMM'
              }
            ]
          }
        }
      };

      $provide.value('Settings', Settings);
    });
  });

  beforeEach(inject(function($filter) {
    _checkInDateFilter = $filter('checkInDate');
    _clock = sinon.useFakeTimers(0 , 'Date');
    _clock.tick(window.moment('2015-01-01T10:53:35+0000').valueOf());
  }));

  afterEach(function(){
    _clock.restore();
  });

  it('should return an empty string if date is not defined', function() {
    expect(_checkInDateFilter()).equal('');
  });

  it('should validate based on max rule when specifyed', function() {
    expect(_checkInDateFilter('2015-01-07')).equal('We');
  });

  it('should validate on min rule when specifyed', function() {
    expect(_checkInDateFilter('2015-02-07')).equal('07 Feb');
  });

  it('should use default formatting when rules were not matched', function() {
    expect(_checkInDateFilter('2015-04-07')).equal('2015 04 07');
    expect(_checkInDateFilter('2014-01-01')).equal('2014 01 01');
  });
});
