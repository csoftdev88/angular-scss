'use strict';

angular.module('mobiusApp.directives.menu', [])

.directive('menuContent', function(contentService, $state){
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: 'directives/menuContent/menuContent.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){

      // We are using different methods for getting the data
      // from the server according to content type. Also, menu
      // items are located under different objects.
      var contentTypes = {
        'news': {
          'method': 'getNews',
          'state': 'news'
        },
        'offers': {
          'method': 'getOffers',
          'state': 'offers'
        },
        'about': {
          'method': 'getAbout',
          'state': 'aboutUs'
        }
      };

      scope.title = attrs.title;

      scope.goToState = function(code) {
        $state.go(contentTypes[attrs.menuContent].state, {code: code}, {reload: true});
      };

      scope.settings = contentTypes[attrs.menuContent];

      var contentType = contentTypes[attrs.menuContent];
      if(contentType){
        contentService[contentType.method]().then(function(data){
          scope.content = data||[];
        });
      }
    }
  };
});
