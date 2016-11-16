'use strict';

angular.module('mobiusApp.directives.slider', [])

.directive('heroSlider', ['$timeout', '$state', '$templateCache', 'Settings',
  'advertsService', '$window', '$filter', function($timeout, $state, $templateCache, Settings,
  advertsService, $window, $filter){
  return {
    restrict: 'E',
    scope: {
      content: '=',
      defaultSlideIndex: '=',
      onSlideClick: '=',
      onRoomClick: '=',
      slideWidth: '=',
      slideHeight: '=',
      thumbWidth: '=?',
      thumbHeight: '=?'
    },
    templateUrl: 'directives/heroSlider/heroSlider.html',

    // Widget logic goes here
    link: function(scope, elem, attrs){
      var SELECTOR_SLIDER_CONTENT = '.slider-content';
      var CLASS_SLIDING_IN = 'sliding-in';
      var CLASS_SLIDING_OUT = 'sliding-out';
      var CLASS_ANIMATION_LEFT = 'animation-left';
      var CLASS_ANIMATION_RIGHT = 'animation-right';

      var SLIDE_TYPE_INFO = 'directives/heroSlider/slides/info.html';
      var SLIDE_TYPE_SIMPLE = 'directives/heroSlider/slides/simple.html';

      var EVENT_KEYDOWN = 'keydown';

      var mainSlide;
      var followingSlide;
      var isAnimating = false;

      var sliderContent = elem.find(SELECTOR_SLIDER_CONTENT);

      var autoplayDelay;
      var timerID;
      var autoPlay = attrs.autoPlay !== 'false';

      // True by default
      scope.hasNotificationBar = attrs.hasNotificationBar !== 'false';
      // False by default
      scope.hasThumbnails = attrs.hasThumbnails === 'true';
      // Counter types - bullets/counter
      scope.counterType = attrs.counterType || 'bullets';

      scope.thumbWidth = scope.thumbWidth || 40;
      scope.thumbHeight = scope.thumbHeight  || 40;

      // Custom easing function
      $.extend($.easing,{
        customEasing: function (x, t, b, c, d) {
          return -c * ((t=t/d-1)*t*t*t - 1) + b;
        }
      });

      function init(){
        scope.slideIndex = scope.defaultSlideIndex || 0;
        // Clearing slider placeholder
        sliderContent.empty();

        cancelAutoplay();

        // No slides found
        if(!scope.content || !scope.content.length){
          return;
        }

        if(Settings.UI.heroSlider.preloadImages){
          preloadImages();
        }

        // Creating initial slide
        mainSlide = createSlide();

        if(scope.content.length > 1){
          autoplayDelay = Settings.UI.heroSlider.autoplayDelay;

          if(autoplayDelay && autoPlay){
            timerID = setInterval(autoSlide, autoplayDelay);
          }
        }
      }

      var unWatchContent = scope.$watch('content', function() {
        init();
      }, false);

      scope.$on('$destroy', function(){
        unWatchContent();
        cancelAutoplay();

        if(!!attrs.keyboard){
          angular.element($window).unbind(EVENT_KEYDOWN);
        }
      });

      // Redirecting to corresponding page
      scope.onContentClick = function(){
        if(isAnimating || !scope.content){
          return;
        }

        var slideData = scope.content[scope.slideIndex];
        if(slideData && slideData.link) {
          advertsService.advertClick(slideData.link);
        }else{
          if(scope.onSlideClick){
            scope.onSlideClick(scope.slideIndex);
          }
          else if(scope.onRoomClick){
            scope.onRoomClick(attrs.room, scope.slideIndex);
          }
        }
      };

      function createSlide(){
        var slideData = scope.content[scope.slideIndex];

        var template;

        if(slideData.title && slideData.subtitle){
          template = $templateCache.get(SLIDE_TYPE_INFO)
            .replace('slide_title', slideData.title)
            .replace('slide_subtitle', slideData.subtitle);
        }else{
          template = $templateCache.get(SLIDE_TYPE_SIMPLE);
        }

        var slide = $(template)[0];
        var resizedSlideUri = (scope.slideWidth !== undefined && scope.slideHeight !== undefined) ? $filter('cloudinaryImage')(slideData.uri,scope.slideWidth,scope.slideHeight,'fill') : slideData.uri;
        $(slide).css('background-image', 'url(' + resizedSlideUri + ')');
        sliderContent.append(slide);

        return $(slide);
      }

      scope.slideToIndex = function(newSlideIndex, $event, isBackwards){

        if($event && autoplayDelay && autoPlay){
          cancelAutoplay();
        }

        scope.preventClick($event);

        if(isAnimating || scope.slideIndex === newSlideIndex || scope.content.length < 2){
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
          var imageURL = scope.content[i].uri;

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

        if(autoplayDelay && autoPlay){
          // Sliding to the next image
          scope.slide(false);
          scope.$digest();
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

      if(!!attrs.keyboard){
        angular.element($window).bind(EVENT_KEYDOWN, function(e) {
          // No keycode or escape is pressed
          if(!e.keyCode || e.keyCode === 27){
            return;
          }

          scope.$evalAsync(function(){
            scope.slide(e.keyCode === 37, e);
          });
        });
      }
    }
  };
}]);
