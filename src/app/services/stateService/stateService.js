'use strict';

angular.module('mobiusApp.services.state', [])
  .service('stateService', ['Settings', '$location', function(Settings, $location) {

    var currency = {};
    var currencyChangeListeners = [];

    function getStateLayout(stateName) {
      var config = Settings.UI.layout[stateName];
      if (!config) {
        return [];
      }

      // List of html templates
      var layout = [];

      for (var i = 0; i < config.length; i++) {
        var areaName = config[i];
        // Check whether area name has template
        var template = Settings.UI.templates[areaName];

        if (template) {
          layout.push(template);
        }
      }

      return layout;
    }

    // Getting language from corresponding meta tag
    function getAppLanguageCode() {
      var meta = $('meta[http-equiv=Content-Language]');
      return meta.attr('content');
    }

    function getAppCurrency() {
      return currency;
    }

    function setAppCurrency(new_currency) {
      currency = new_currency;
      notifyAppCurrencyChangeListeners();
      $location.search(Settings.currencyParamName, currency.code);
    }

    function addAppCurrencyChangeListener(listener) {
      if (currencyChangeListeners.indexOf(listener) < 0) {
        currencyChangeListeners.push(listener);
      }
    }

    function removeAppCurrencyChangeListener(listener) {
      var index = currencyChangeListeners.indexOf(listener);
      if (index >= 0) {
        currencyChangeListeners.splice(index, 1);
      }
    }

    function notifyAppCurrencyChangeListeners() {
      for (var i in currencyChangeListeners) {
        if (currencyChangeListeners.hasOwnProperty(i)) {
          currencyChangeListeners[i](currency);
        }
      }
    }

    function setDefaultScopeAppCurrencyChangeListener($scope) {
      function setCurrency(currency) {
        $scope.currencyCode = currency.code;
      }

      addAppCurrencyChangeListener(setCurrency);
      setCurrency(getAppCurrency());

      $scope.$on('$destroy', function() {
        removeAppCurrencyChangeListener(setCurrency);
      });
    }

    // Public methods
    return {
      getStateLayout: getStateLayout,
      getAppLanguageCode: getAppLanguageCode,
      getAppCurrency: getAppCurrency,
      setAppCurrency: setAppCurrency,
      addAppCurrencyChangeListener: addAppCurrencyChangeListener,
      removeAppCurrencyChangeListener: removeAppCurrencyChangeListener,
      setDefaultScopeAppCurrencyChangeListener: setDefaultScopeAppCurrencyChangeListener
    };
  }]);
