'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams,
  bookingService, propertyService, filtersService){
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'directives/room/room.html',

    // Widget logic goes here
    link: function(scope){

      var bookingParams = bookingService.getAPIParams();

      var propertyCode = bookingParams.property;
      delete bookingParams.property;

      var roomCode = $stateParams.roomID;

      // Getting room details
      propertyService.getRoomDetails(propertyCode, roomCode).then(function(data){
        console.log(data, 'roomDetails');
        scope.details = data;

        // Updating room hero slider images
        var heroContent =  data.images.map(function(image){
          return {'image': image.URI};
        });

        scope.updateHeroContent(heroContent);
      });

      // Room product details
      function getRoomProductDetails(propertyCode, roomCode, params){
        propertyService.getRoomProductDetails(propertyCode, roomCode, params).then(function(data){
          //scope.details = data;
          console.log(data, 'room products');
        });
      }

      if(bookingParams.productGroupId){
        getRoomProductDetails(propertyCode, roomCode, bookingParams);
      } else{
        // productGroupId is not set by the widget - getting default BAR
        filtersService.getBestRateProduct().then(function(brp){
          if(brp){
            bookingParams.productGroupId = brp.id;
          }

          getRoomProductDetails(propertyCode, roomCode, bookingParams);
        });
      }



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
        {type: 'Best available Rate', subtitle: 'Book now!', price: 79, icon: 'star-1', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu convallis odio. Aliquam blandit neque felis, a viverra purus varius quis. Vestibulum augue ante, mattis ac neque non, ultricies rutrum felis. Integer in mattis lorem. Nulla purus diam, rutrum id purus in, iaculis aliquet orci. Nunc vehicula, lectus eu dictum.'},
        {type: 'Bed and Breakfast', subtitle: 'Breakfast for 2 included', price: 89, icon: 'coffee', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu convallis odio. Aliquam blandit neque felis, a viverra purus varius quis. Vestibulum augue ante, mattis ac neque non, ultricies rutrum felis. Integer in mattis lorem. Nulla purus diam, rutrum id purus in, iaculis aliquet orci. Nunc vehicula, lectus eu dictum.'},
        {type: 'All Inclusive', subtitle: 'All meals included', price: 119, icon: 'food', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu convallis odio. Aliquam blandit neque felis, a viverra purus varius quis. Vestibulum augue ante, mattis ac neque non, ultricies rutrum felis. Integer in mattis lorem. Nulla purus diam, rutrum id purus in, iaculis aliquet orci. Nunc vehicula, lectus eu dictum.'},
        {type: 'Luxury Package', subtitle: 'All meals included plus bottle of champagne, robes and a fruit basket', price: 139, icon: 'wine', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu convallis odio. Aliquam blandit neque felis, a viverra purus varius quis. Vestibulum augue ante, mattis ac neque non, ultricies rutrum felis. Integer in mattis lorem. Nulla purus diam, rutrum id purus in, iaculis aliquet orci. Nunc vehicula, lectus eu dictum.'}
      ];

      scope.oneAtATime = true;
    }

  };
});
