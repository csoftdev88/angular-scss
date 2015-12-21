'use strict';

angular.module('mobiusApp.directives.taTeaser', [])

  .directive('taTeaser', ['Settings', 'bookingService', '_', function(Settings, bookingService, _) {
    return {
      restrict: 'E',
      templateUrl: 'directives/taTeaser/taTeaser.html',

      // Widget logic goes here
      link: function(scope) {

        //TODO: move into settings
        scope.isCarousel = false;

        var maxNumOfTestimonialsStars = Settings.UI.hotelDetailsTestimonialsMaxNumStars;
        var bookingParams = bookingService.getAPIParams();
        var propertyCode = bookingService.getCodeFromSlug(bookingParams.propertySlug);

        //Get property specific testiomonials
        var propertyTestimonials = _.reject(Settings.UI.hotelDetailsTestimonials, function(testimonial){ 
          return testimonial.property !== propertyCode;
        });

        //appply random testimonial
        if(scope.isCarousel){

        }
        else{
          scope.testimonial = propertyTestimonials[_.random(0, propertyTestimonials.length-1)];
        }
        
        scope.getNumberOfReviewStars = function(num) {
          if(!num){
            return;
          }
          return new Array(num);   
        };
        scope.getNumberOfEmptyReviewStars = function(num) {
          if(!num){
            return;
          }
          return new Array(maxNumOfTestimonialsStars-num);  
        };

      }
    };
  }]);
