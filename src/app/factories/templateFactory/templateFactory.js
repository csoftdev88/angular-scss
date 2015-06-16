'use strict';

angular.module('mobiusApp.factories.template', [])
  .factory('templateFactory', function() {

    function templateEngine(templateString, data) {
      var re = /{{([^}]+)}}/, match;
      while ((match = re.exec(templateString))) {
        templateString = templateString.replace(match[0], data[match[1]]);
      }
      return templateString;
    }

    // Public method
    return templateEngine;
  });
