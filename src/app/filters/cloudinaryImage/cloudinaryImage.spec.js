'use strict';

describe('cloudinaryImage', function() {
  var env;

  beforeEach(function() {
    env = {};
  });

  beforeEach(function() {
    module('mobiusApp.filters.cloudinaryImage');
  });

  beforeEach(inject(function($filter) {
    env.$filter = $filter;
  }));

  it('should set width, height and fill of the image', function() {
    expect(env.$filter('cloudinaryImage')
      ('http://res.cloudinary.com/dmh2cjswj/image/upload/v1435746996/TEST/TEST/TEST_NAME.jpg', 10,20,'fill'))
    .equal('http://res.cloudinary.com/dmh2cjswj/image/upload/w_10,h_20,c_fill,q_auto,f_auto/v1435746996/TEST/TEST/TEST_NAME.jpg');
  });

  it('should not update the URL when not a cloudinary image', function() {
    expect(env.$filter('cloudinaryImage')
      ('http://res.someother.com/dmh2cjswj/image/upload/v1435746996/TEST/TEST/TEST_NAME.jpg', 10,20,'fill'))
    .equal('http://res.someother.com/dmh2cjswj/image/upload/v1435746996/TEST/TEST/TEST_NAME.jpg');
  });
});
