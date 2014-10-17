'use strict';

angular.module('mobiusApp.directives.slider', [])

.directive('heroSlider', function($timeout, $location, Settings){
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

      var SLIDE_TEMPLATE = '<div class="hero-slide">' +
        '<div class="content-inner">' +
        '<h1 class="slide-title"><span>slide_title</span></h1>' +
        '<h2 class="slide-subtitle"><span>slide_subtitle</span></h2>' +
        '</div>' +
        '</div>';

      var mainSlide;
      var followingSlide;
      var isAnimating = false;

      var sliderContent = elem.find(SELECTOR_SLIDER_CONTENT);

      var autoplayDelay;
      var timerID;

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

        cancelAutoplay();

        // No slides found
        if(!scope.content.length){
          return;
        }

        if(Settings.UI.heroSlider.preloadImages){
          preloadImages();
        }

        // Creating initial slide
        mainSlide = createSlide();

        if(scope.content.length > 1){
          autoplayDelay = Settings.UI.heroSlider.autoplayDelay;

          if(autoplayDelay){
            timerID = setInterval(autoSlide, autoplayDelay);
          }
        }
      }

      scope.$watch('content', function() {
        init();
      });

      // Redirecting to corresponding page
      scope.onContentClick = function(){
        var slideData = scope.content[scope.slideIndex];

        if(slideData.categoryName && slideData.ID){
          $location.path('/offers/' + slideData.categoryName + '/' + slideData.ID);
        }
      };

      function createSlide(){
        var slideData = scope.content[scope.slideIndex];

        var template = SLIDE_TEMPLATE
          .replace('slide_title', slideData.title)
          .replace('slide_subtitle', slideData.subtitle);

        var slide = $(template)[0];

        $(slide).css('background-image', 'url(' + slideData.image + ')');
        sliderContent.append(slide);

        return $(slide);
      }

      scope.slideToIndex = function(newSlideIndex, $event, isBackwards){
        if($event && autoplayDelay){
          cancelAutoplay();
        }

        if(isAnimating){
          return;
        }

        scope.preventClick($event);

        if(isBackwards===undefined){
          // Detecting direction according to a new slide index
          if(newSlideIndex > scope.slideIndex){
            isBackwards = false;
          }else{
            isBackwards = true;
          }
        }

        var finalPosition = isBackwards?-sliderContent.width():sliderContent.width();

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
            duration: Settings.UI.heroSlider.animationDuration,
            easing: 'customEasing',
            step: function( marginLeft ){
              $(mainSlide).css('margin-left', marginLeft);
              $(followingSlide).css('margin-left', marginLeft+finalPosition);
            },
            complete: onAnimationComplete
          }
        );
      };

      scope.slide = function(isBackwards, $event){
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

        scope.slideToIndex(newSlideIndex, $event, isBackwards);
      };

      scope.preventClick = function($event){
        if($event){
          $event.preventDefault();
          $event.stopPropagation();
        }
      };

      function onAnimationComplete(){
        isAnimating = false;

        mainSlide.remove();
        mainSlide = followingSlide;

        mainSlide
          .removeClass(CLASS_SLIDING_OUT)
          .removeClass(CLASS_SLIDING_IN)
          .removeClass(CLASS_ANIMATION_RIGHT)
          .removeClass(CLASS_ANIMATION_LEFT);

        followingSlide = undefined;
      }

      function preloadImages(){
        for(var i=0; i<scope.content.length; i++){
          var imageURL = scope.content[i].image;

          preloadImage(imageURL);
        }
      }

      function preloadImage(imageURL){
        if(!imageURL){
          return;
        }

        var image = new Image();
        image.src = imageURL;
      }

      function autoSlide(){
        if(autoplayDelay){
          // Sliding to the next image
          scope.slide(false);
          scope.$apply();
        }else{
          cancelAutoplay();
        }
      }

      function cancelAutoplay(){
        autoplayDelay = 0;
        if(timerID!==undefined){
          clearInterval(timerID);
        }
      }
    }
  };
});
