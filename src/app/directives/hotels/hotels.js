'use strict';

angular.module('mobiusApp.directives.hotels', [])

.directive('hotels', function(){
  console.log('hotels');
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/hotels/hotels.html',

    // Widget logic goes here
    link: function(scope){
      //scope, elem, attrs
      scope.sorting = {};

      scope.sortings = [
        {priceAsc: 'Price Low to High'},
        {priceDesc: 'Price High to Low'},
        {ratingAsc: 'Star Rating Low to High'},
        {ratingDesc: 'Star Rating High to Low'},
        {alphabetAsc: 'A - Z'},
        {alphabetdesc: 'Z - A'}
      ];

      scope.hotels = [
        { name: 'Madrid', rating: 4, price: 69},
        { name: 'Ibiza', rating: 5, price: 89},
        { name: 'Cordoba', rating: 3, price: 59},
        { name: 'Lisbon', rating: 4, price: 66},
        { name: 'Valencia', rating: 2, price: 49},
        { name: 'Barcelona', rating: 5, price: 95}
      ];

      console.log(scope);
    }
  };
});
