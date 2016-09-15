'use strict';

angular.module('mobiusApp.directives.taTeaser', [])

  .directive('taTeaser', ['Settings', 'bookingService', '_', '$interval', function(Settings, bookingService, _, $interval) {
    return {
      restrict: 'E',
      templateUrl: 'directives/taTeaser/taTeaser.html',

      // Widget logic goes here
      link: function(scope) {

        //TODO: move into settings
        scope.isCarousel = Settings.UI.hotelDetailsTestimonialsCarousel;

        var maxNumOfTestimonialsStars = Settings.UI.hotelDetailsTestimonialsMaxNumStars;
        var bookingParams = bookingService.getAPIParams();
        var propertyCode = bookingService.getCodeFromSlug(bookingParams.propertySlug);
        var interval;
        var carouselInterval = Settings.UI.hotelDetailsTestimonialsCarouselDelay;
        

        //Get property specific testiomonials
        var propertyTestimonials = _.reject(Settings.UI.hotelDetailsTestimonials, function(testimonial){ 
          return testimonial.property !== propertyCode;
        });

        //Carousel
        if(scope.isCarousel){

          scope.testimonials = propertyTestimonials;
          var numTestimonials = scope.testimonials.length - 1;
          var curTestimonial = 0;

          //carousel interval
          $interval.cancel(interval);
          interval = $interval(function () {
              //hide current
              $('.testimonial-container.carousel-item').eq(curTestimonial).removeClass('in');
              if (curTestimonial === numTestimonials) {
                curTestimonial = 0;
              } 
              else {
                curTestimonial++;
              }
              //show next
              $('.testimonial-container.carousel-item').eq(curTestimonial).addClass('in');

            }, carouselInterval);
            
        }
        //If not carousel apply random testimonial
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

        scope.$on('$destroy', function() {
          $interval.cancel(interval);
        });

      }
    };
  }]);
