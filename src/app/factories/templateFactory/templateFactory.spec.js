'use strict';

describe('templateFactory', function() {
  var env;

  beforeEach(function() {
    env = {};
    module('mobiusApp.factories.template');
    inject(function(templateFactory) {
      env.templateFactory = templateFactory;
    });
  });

  it('should properly format template', function() {
    expect(env.templateFactory('My {{fruit}} is {{color}}.', {fruit: 'apple', color: 'red'})).equal('My apple is red.');
  });
});
