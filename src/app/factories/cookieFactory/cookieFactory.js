'use strict';

/*
 * CookieFactory - replacement for $cookies
 * service
 */
angular.module('mobiusApp.factories.cookie', [])

.factory('cookieFactory', function($window) {
  function getCookie(name) {
    var cookies = $window.document.cookie.split(';');

    for(var i=0; i < cookies.length; i++) {
      var c = cookies[i];
      c = c.charAt(0) === ' '?c.substring(1):c;
      if (c.indexOf(name + '=') === 0) {
        return c.substring(name.length + 1, c.length);
      }
    }
    return null;
  }

  // Public method
  return getCookie;
});
