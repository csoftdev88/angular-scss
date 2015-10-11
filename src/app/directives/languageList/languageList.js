'use strict';

angular.module('mobiusApp.directives.language', [])

  .directive('languageList', ['$window', 'Settings', 'stateService', 'contentService', '_', '$location', function($window, Settings, stateService, contentService, _, $location) {
    function encodeQueryData(data) {
      var ret = [];
      for (var d in data) {
        if(data.hasOwnProperty(d)) {
          ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
      }
      return ret.join(' ');
    }

    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'directives/languageList/languageList.html',

      // Widget logic goes here
      link: function(scope) {

        contentService.getLanguages().then(function(data) {
          
          var languages = {};
          _.each(data, function(languageData) {
            if (!Settings.UI.languages[languageData.code]) {
              throw new Error('Language "' + languageData.code + '" not found in configuration', languageData);
            } else {
              languageData = _.assign(languageData, Settings.UI.languages[languageData.code]);
              languages[languageData.code] = languageData;
            }
          });

          scope.languages = _.values(languages);
        });

        scope.changeLanguage = function(language) {
          var language_code = language.default ? '' : language.code;
          var path = $location.path();
          var search = encodeQueryData($location.search());
          var hash = $location.hash();

          $window.location.replace((language_code ? '/' + language_code : '') + path + (search ? '?' + search : '') + (hash ? '#' + hash : ''));
        };

        scope.getShortName = function(languageCode) {
          return Settings.UI.languages[languageCode].shortName;
        };

        scope.getFullName = function(languageCode) {
          return Settings.UI.languages[languageCode].name;
        };

        scope.currentLanguage = stateService.getAppLanguageCode();
      }
    };
  }]);
