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
          'state': 'news',
          'reload': true,
          'code' : ''
        },
        'offers': {
          'method': 'getOffers',
          'state': 'offers',
          'reload': true,
          'code' : ''
        },
        'about': {
          'method': 'getAbout',
          'state': 'aboutUs',
          'reload': true,
          'code' : ''
        }
      };

      scope.title = attrs.title;

      scope.goToState = function() {
        $state.go(contentTypes[attrs.menuContent].state, {code: contentTypes[attrs.menuContent].code}, {reload: contentTypes[attrs.menuContent].reload});
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
