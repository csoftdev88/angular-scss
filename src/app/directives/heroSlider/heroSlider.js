'use strict';

angular.module('mobiusApp.directives.slider', [])

.directive('heroSlider', function($window){
  return {
    restrict: 'E',
    scope: {
      content: '='
    },
    templateUrl: 'directives/heroSlider/heroSlider.html',

    // Widget logic goes here
    link: function(scope, elem){
      var CLASS_SLIDER_CONTENT = '.slider-content';
      var sliderContent = elem.find(CLASS_SLIDER_CONTENT);
      var sliderWidth = 0;

      var slideTemplate = '<div class="hero-slide"></div>';

      var currentSlideIndex = 0;

      scope.$watch('content', function() {
        console.log(scope.content);
        console.log(sliderContent);

        updateSlides();
      });

      function updateSlides(){
        currentSlideIndex = 0;
        if(!scope.content.length){
          return;
        }

        // Clearing slider placeholder
        sliderContent.empty();

        insertSlide();
      }

      function insertSlide(){
        var activeSlide = $(slideTemplate);
        sliderContent.append(activeSlide);
      }

      var resizeListener = angular.element($window).bind('resize', function() {
        return updateWidth();
      });

      function updateWidth(){
        sliderWidth = sliderContent.width();
      }

      scope.$on('$destroy', function(){
        // Removing global listeners
        if(resizeListener){
          resizeListener();
        }
      });
    }
  };
});
