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

      scope.pages = [0,1,2,3];

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

      scope.slide = function(toLeft){
        if(isAnimating){
          return;
        }

        var finalPosition = sliderContent.width();
        if(toLeft){
          finalPosition = 0 - finalPosition;
        }

        var animationClass = finalPosition<0?CLASS_ANIMATION_RIGHT:CLASS_ANIMATION_LEFT;

        console.log(animationClass);
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
