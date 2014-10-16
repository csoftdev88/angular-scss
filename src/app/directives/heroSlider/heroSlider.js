'use strict';

angular.module('mobiusApp.directives.slider', [])

.directive('heroSlider', function(){
  return {
    restrict: 'E',
    scope: {
      content: '='
    },
    templateUrl: 'directives/heroSlider/heroSlider.html',

    // Widget logic goes here
    link: function(scope, elem){
      var CLASS_SLIDER_CONTENT = '.slider-content';
      //var ANIMATION_EASING = 'swing';
      var ANIMATION_DURATION = 700;

      var slideTemplate = '<div class="hero-slide">' +
        '<div class="content-inner">' +
        '<h1 class="slide-title"><span>Some Amazing <strong>Offer</strong></span></h1>' +
        '<h2 class="slide-subtitle"><span>Subtitle text explaining the offer further</span></h2>' +
        '</div>' +
        '</div>';

      var currentSlideIndex = 0;
      var mainSlide;
      var followingSlide;

      var isAnimating = false;

      var sliderContent = elem.find(CLASS_SLIDER_CONTENT);

      // Custom easing function
      $.extend($.easing,{
        customEasing: function (x, t, b, c, d) {
          return -c * ((t=t/d-1)*t*t*t - 1) + b;
        }
      });

      function init(){
        currentSlideIndex = 0;

        // Clearing slider placeholder
        sliderContent.empty();

        if(!scope.content.length){
          return;
        }

        mainSlide = createSlide();
      }

      scope.$watch('content', function() {
        init();
      });

      function createSlide(){
        var slide = $(slideTemplate)[0];

        sliderContent.append(slide);

        return slide;
      }

      scope.slide = function(toLeft){
        if(isAnimating){
          return;
        }

        var finalPosition = sliderContent.width();
        if(toLeft){
          finalPosition = 0 - finalPosition;
        }

        followingSlide = createSlide();

        isAnimating = true;

        $({marginLeft:0})
        .animate(
          {
            marginLeft: -finalPosition
          },
          {
            duration: ANIMATION_DURATION,
            easing: 'customEasing',
            step: function( marginLeft ){
              $(mainSlide).css('margin-left', marginLeft);
              $(followingSlide).css('margin-left', marginLeft+finalPosition);
            },
            complete: onAnimationComplete
          }
        );
      };

      function onAnimationComplete(){
        console.log('complete');

        isAnimating = false;

        mainSlide.remove();
        mainSlide = followingSlide;

        followingSlide = undefined;
      }
    }
  };
});
