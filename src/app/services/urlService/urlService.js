(function () {
  'use strict';

  angular
    .module('mobiusApp.utilities', [])
    .service('UrlService', UrlService);

  /**
   * Retrieve the value of a URL parameter by name
   * @return {string}
   */
  function UrlService () {

    this.getParameter = function (name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

  }

}());
