'use strict';

angular.module('mobiusApp.directives.currency', [])

.directive('currencyList', function(Settings, contentService, $document){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/currencyList/currencyList.html',

    // Widget logic goes here
    link: function(scope, elem){
      var isOpen = false,
          child = elem.children(),
          close = angular.noop;

      // Handle opening and closing dropdown menu
      elem.bind('click', function(event){
        event.preventDefault();
        event.stopPropagation();

        if (isOpen){
          child.removeClass('open');
          isOpen = false;
        } else {
          child.addClass('open');
          isOpen = true;

          close = function(event){
            if (event){
              event.preventDefault();
              event.stopPropagation();
            }
            child.removeClass('open');
            isOpen = false;
            $document.unbind('click', close);
            close = angular.noop;
          };

          $document.bind('click', close);
        }
      });

      contentService.getCurrencies().then(function(data){
        scope.currencies = data.currencies||[];

        if(scope.currencies.length){
          scope.changeCurrency(scope.currencies[0]);
        }
      });

      scope.getCurrencySymbol = function(code){
        if(!code){
          return '';
        }

        var data = Settings.UI.currencies[code];
        if(!data){
          throw 'Currency "' + code + '" is not found in configuration.';
        }

        return data.symbol;
      };

      scope.getFormattedLabel = function(code){
        return code + '(' + scope.getCurrencySymbol(code) + ')';
      };

      scope.changeCurrency = function(currency){
        scope.currentCurrency = currency;
      };
    }
  };
});
