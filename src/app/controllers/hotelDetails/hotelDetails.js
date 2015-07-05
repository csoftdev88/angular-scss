'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService, $state, contentService,
  propertyService, filtersService, preloaderFactory, $q, modalService, breadcrumbsService,
  $window, advertsService, $controller, $timeout) {

  $controller('PriceCtr', {$scope: $scope});

  var SHORT_DESCRIPTION_LENGTH = 200;
  var NUMBER_OF_OFFERS = 3;
  var bookingParams = bookingService.getAPIParams();
  // Include the amenities
  bookingParams.includes = 'amenities';

  var propertyCode = bookingParams.propertyCode;

  // TODO: Change to a classic selectors . #
  function scrollTo(hash, speed, offset) {
    $window._.defer(function () {
      var $item = angular.element('#' + hash);
      if($item.length) {
        angular.element('html, body').animate({
          scrollTop: $item.offset().top + offset
        }, speed || 300);
      }
    });
  }

  $scope.scrollToBreadcrumbs = function(){
    $timeout(function(){
      scrollTo('breadcrumbs', 1200, -angular.element('#main-header').height());
    }, 0);
  };

  function getHotelDetails(propertyCode, params){
    // NOTE: In case when productGroupId is not presented in
    // bookingParams - property details are returned without
    // availability details
    var detailPromise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){
        $scope.details = details;

        $scope.details.description = ('' + $scope.details.description);
        var firstParaEnd = $scope.details.description.indexOf('</p>');
        var firstBr = $scope.details.description.indexOf('<br>');
        firstParaEnd = Math.max(firstParaEnd, 0);
        firstBr = Math.max(firstBr, 0);
        var shortDescLength = (firstBr > 0 && firstParaEnd > 0) ? Math.min(firstBr, firstParaEnd) : Math.max(firstBr, firstParaEnd);
        $scope.details.descriptionShort = $scope.details.description.substr(0, shortDescLength > 0 ? ($scope.details.description.indexOf('>', shortDescLength) + 1) : SHORT_DESCRIPTION_LENGTH);
        $scope.details.hasViewMore = $scope.details.descriptionShort.length < $scope.details.description.length;

        breadcrumbsService.addBreadCrumb('Hotels', 'hotels').addBreadCrumb(details.nameShort);

        breadcrumbsService
          .addHref('About', 'jsAbout')
          .addHref('Location', 'jsLocation')
          .addHref('Offers', 'jsOffers')
          .addHref('Rooms', 'jsRooms');

        // Updating Hero content images
        if(details.images){
          $scope.updateHeroContent($window._.filter(details.images, {includeInSlider: true}));

          // NOTE: (Alex)Could be done as modalService.openGallery.bind(modalService,...)
          // Current version of PhantomJS is missing not supporting .bind
          // https://github.com/ariya/phantomjs/issues/10522
          // TODO: Update PhantomJS
          $scope.openGallery = function(){
            modalService.openGallery(
              details.images.map(function(image){return image.uri;})
            );
          };
        }

        if(details.hasOwnProperty('available')) {
          roomsPromise.then(function() {
            $scope.availableRooms = [];
            $window._.forEach((details.availability && details.availability.rooms) || [], function(availableRoom) {
              var room = $window._.find($scope.rooms, {code: availableRoom.code});
              if(room) {
                room = $window._.extend(room, availableRoom);
                $scope.availableRooms.push(room.code);
              }
            });
          });
        }

        var offersParams = $window._.extend({}, bookingParams);
        delete offersParams.promoCode;
        delete offersParams.corpCode;
        delete offersParams.groupCode;
        contentService.getOffers(offersParams).then(function(response) {
          $scope.offersList = response.splice(0, NUMBER_OF_OFFERS);
          if(!$scope.offersList || $window._.isEmpty($scope.offersList)) {
            breadcrumbsService.removeHref('Offers');
          }
        });

        $scope.scrollToBreadcrumbs();

      }, function() {
        $state.go('hotels');
      });

    var roomsPromise = propertyService.getRooms(propertyCode)
      .then(function(rooms){
        $scope.rooms = rooms;
      });

    preloaderFactory($q.all([detailPromise, roomsPromise]).then(function() {
      var hash = $window.location.hash;
      if (hash) {
        scrollTo(hash.substr(1));
      }
    }));
  }

  // In order to get rooms availability we must call the API with productGroupId
  // param which is presented as rate parameter set by a bookingWidget
  if(bookingParams.productGroupId){
    getHotelDetails(propertyCode, bookingParams);
  } else{
    // productGroupId is not set by the widget - getting default BAR
    filtersService.getBestRateProduct().then(function(brp){
      if(brp){
        bookingParams.productGroupId = brp.id;
      }

      getHotelDetails(propertyCode, bookingParams);
    });
  }

  $scope.scrollToRooms = function() {
    scrollTo('jsRooms');
  };

  $scope.advertClick = advertsService.advertClick;
});
