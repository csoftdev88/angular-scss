'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/room/room.html',

    // Widget logic goes here
    link: function(scope){
      scope.room = {};
      scope.room.name = 'Deluxe Double Room';
      scope.room.perex = 'am eu ipsum ac metus sagittis pellentesque id ut magna. Nunc in nibh nibh. Morbi nec turpis at est pretium fermentum. Praesent a condimentum leo. Aenean egestas leo ac enim consequat tincidunt jes. Ut et purus leo. Suspendisse potenti. Class aptent taciti sociosqu ad litora torquent.';
      scope.room.description = 'Iam eu ipsum ac metus sagittis pellentesque id ut magna. Nunc in nibh nibh. Morbi nec turpis at est pretium fermentum. Praesent a condimentum leo. Aenean egestas leo ac enim consequat tincidunt jes. Ut et purus leo. Suspendisse potenti. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.';

      scope.amenities = [
        {name: 'Easy Acces', icon: 'wheelchair'},
        {name: 'WiFi throughout', icon: 'signal'},
        {name: 'Multi lingual staff', icon: 'globe'},
        {name: 'Secure area for valuables', icon: 'lock'},
        {name: 'Bureau de change', icon: 'dollar'}
      ];

      scope.rates = [
        {type: 'Best available Rate', subtitle: 'Book now!', price: 79, currency: '£', icon: 'star-1', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu convallis odio. Aliquam blandit neque felis, a viverra purus varius quis. Vestibulum augue ante, mattis ac neque non, ultricies rutrum felis. Integer in mattis lorem. Nulla purus diam, rutrum id purus in, iaculis aliquet orci. Nunc vehicula, lectus eu dictum.'},
        {type: 'Bed and Breakfast', subtitle: 'Breakfast for 2 included', price: 89, currency: '£', icon: 'coffee', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu convallis odio. Aliquam blandit neque felis, a viverra purus varius quis. Vestibulum augue ante, mattis ac neque non, ultricies rutrum felis. Integer in mattis lorem. Nulla purus diam, rutrum id purus in, iaculis aliquet orci. Nunc vehicula, lectus eu dictum.'},
        {type: 'All Inclusive', subtitle: 'All meals included', price: 119, currency: '£', icon: 'food', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu convallis odio. Aliquam blandit neque felis, a viverra purus varius quis. Vestibulum augue ante, mattis ac neque non, ultricies rutrum felis. Integer in mattis lorem. Nulla purus diam, rutrum id purus in, iaculis aliquet orci. Nunc vehicula, lectus eu dictum.'},
        {type: 'Luxury Package', subtitle: 'All meals included plus bottle of champagne, robes and a fruit basket', price: 139, currency: '£', icon: 'wine', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu convallis odio. Aliquam blandit neque felis, a viverra purus varius quis. Vestibulum augue ante, mattis ac neque non, ultricies rutrum felis. Integer in mattis lorem. Nulla purus diam, rutrum id purus in, iaculis aliquet orci. Nunc vehicula, lectus eu dictum.'}
      ];

      scope.oneAtATime = true;
    }

  };
});
