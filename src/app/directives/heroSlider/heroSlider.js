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
      var SELECTOR_SLIDER_CONTENT = '.slider-content';
      var CLASS_SLIDING_IN = 'sliding-in';
      var CLASS_SLIDING_OUT = 'sliding-out';
      var CLASS_ANIMATION_LEFT = 'animation-left';
      var CLASS_ANIMATION_RIGHT = 'animation-right';

      var ANIMATION_DURATION = 700;

      var slideTemplate = '<div class="hero-slide">' +
        '<div class="content-inner">' +
        '<h1 class="slide-title"><span>Some Amazing <strong>Offer</strong></span></h1>' +
        '<h2 class="slide-subtitle"><span>Subtitle text explaining the offer further</span></h2>' +
        '</div>' +
        '</div>';

      var mainSlide;
      var followingSlide;

      var isAnimating = false;

      var sliderContent = elem.find(SELECTOR_SLIDER_CONTENT);

      // Custom easing function
      $.extend($.easing,{
        customEasing: function (x, t, b, c, d) {
          return -c * ((t=t/d-1)*t*t*t - 1) + b;
        }
      });

      function init(){
        scope.slideIndex = 0;
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

        return $(slide);
      }

      scope.slideToIndex = function(newSlideIndex, isBackwards){
        if(isAnimating){
          return;
        }

        if(isBackwards===undefined){
          // Detecting direction according to a new slide index
          if(newSlideIndex > scope.slideIndex){
            isBackwards = false;
          }else{
            isBackwards = true;
          }
        }

        var finalPosition = sliderContent.width();
        if(isBackwards){
          finalPosition = 0 - finalPosition;
        }

        scope.slideIndex = newSlideIndex;

        var animationClass = finalPosition<0?CLASS_ANIMATION_RIGHT:CLASS_ANIMATION_LEFT;

        followingSlide = createSlide();

        followingSlide.addClass(animationClass).addClass(CLASS_SLIDING_IN);
        mainSlide.addClass(animationClass).addClass(CLASS_SLIDING_OUT);

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

      scope.slide = function(isBackwards){
        var newSlideIndex = scope.slideIndex;

        if(isBackwards){
          newSlideIndex--;
        }else{
          newSlideIndex++;
        }

        if(newSlideIndex < 0){
          newSlideIndex = scope.content.length - 1;
        }else if(newSlideIndex > scope.content.length - 1){
          newSlideIndex = 0;
        }

        scope.slideToIndex(newSlideIndex, isBackwards);
      };

      function onAnimationComplete(){
        isAnimating = false;

        mainSlide.remove();
        mainSlide = followingSlide;

        mainSlide
          .removeClass(CLASS_SLIDING_OUT)
          .removeClass(CLASS_SLIDING_IN);
          //.removeClass(CLASS_ANIMATION_RIGHT)
          //.removeClass(CLASS_ANIMATION_LEFT);

        followingSlide = undefined;
      }
    }
  };
});
