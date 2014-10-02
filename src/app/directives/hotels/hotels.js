'use strict';

angular.module('mobiusApp.directives.hotels', [])

.directive('hotels', ['$location', function($location){
  console.log('hotels');
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/hotels/hotels.html',

    // Widget logic goes here
    link: function(scope){
      //scope, elem, attrs
      var desc = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh';

      scope.sorting = {};
      scope.view = 'tiles';

      scope.sortings = [
        'Price Low to High',
        'Price High to Low',
        'Star Rating Low to High',
        'Star Rating High to Low',
        'A - Z',
        'Z - A'
      ];

      scope.hotels = [
        { name: 'Madrid', rating: 4, price: 69, desc: desc},
        { name: 'Ibiza', rating: 5, price: 89, desc: desc},
        { name: 'Cordoba', rating: 3, price: 59, desc: desc},
        { name: 'Lisbon', rating: 4, price: 66, desc: desc},
        { name: 'Valencia', rating: 2, price: 49, desc: desc},
        { name: 'Barcelona', rating: 5, price: 95, desc: desc}
      ];

      console.log(scope);

      scope.go = function(path){
        $location.path(path);
      };
    }
  };
}]);
