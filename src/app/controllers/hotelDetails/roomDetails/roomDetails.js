'use strict';
/*
*  Generic controller for room details and reservation pages
*/
angular.module('mobius.controllers.room.details', [])

.controller( 'RoomDetailsCtrl', function($scope, $rootScope, $timeout, $q, _, modalService,
  propertyService, filtersService, bookingService, $window, contentService, dataLayerService, Settings, chainService, $stateParams, mobiusTrackingService) {

  var numNights = 1;

  $scope.setRoomDetails = function(roomDetails){

    $scope.roomDetails = roomDetails;

    if($scope.config.bookingStatistics && $scope.config.bookingStatistics.display && $scope.roomDetails.statistics && $scope.roomDetails.statistics.length){
      $timeout(function(){
        var statistic = $scope.roomDetails.statistics[0];
        $rootScope.$broadcast('GROWL_ALERT', statistic);
      });
    }

    $scope.openGallery = function(slideIndex){
      modalService.openGallery(
        contentService.getLightBoxContent(roomDetails.images),
        slideIndex
      );
    };
  };

  $scope.openPoliciesInfo = function(products){
    // Tracking product view
    chainService.getChain(Settings.API.chainCode).then(function(chainData) {
      propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
        dataLayerService.trackProductsDetailsView(
          products.map(function(p){
            return {
              name: p.name,
              id: p.code,
              price: (p.price.totalBaseAfterPricingRulesAfterPricingRules/numNights).toFixed(2),
              quantity: numNights,
              dimension2: chainData.nameShort,
              brand: propertyData.nameLong,
              dimension1: propertyData.nameShort,
              list: 'Room',
              category: $scope.roomDetails && $scope.roomDetails.name ? $scope.roomDetails.name : null
            };
          }));
      });
    });

    modalService.openPoliciesInfo(products);
  };

  $scope.openPriceBreakdownInfo = function(product) {
    var room = _.clone($scope.roomDetails);
    room._selectedProduct = product;

    // Tracking product view
    chainService.getChain(Settings.API.chainCode).then(function(chainData) {
      propertyService.getPropertyDetails($stateParams.propertyCode || $stateParams.property).then(function(propertyData){
        dataLayerService.trackProductsDetailsView([{
          name: product.name,
          id: product.code,
          price: (product.price.totalBaseAfterPricingRules/numNights).toFixed(2),
          quantity: numNights,
          dimension2: chainData.nameShort,
          brand: propertyData.nameLong,
          dimension1: propertyData.nameShort,
          list: 'Room',
          category: $scope.roomDetails.name
        }]);
      });
    });

    return modalService.openPriceBreakdownInfo([room]);
  };

  $scope.getRoomData = function(propertyCode, roomCode){
    var qBookingParam = $q.defer();
    var qRoomData = $q.defer();

    var bookingParams = bookingService.getAPIParams(true);
    numNights = $window.moment(bookingParams.to).diff(bookingParams.from, 'days');

    // Using PGID from the booking params
    if(bookingParams.productGroupId){
      qBookingParam.resolve(bookingParams);
    } else {
      filtersService.getBestRateProduct().then(function(brp){
        if(brp){
          bookingParams.productGroupId = brp.id;
        }
        qBookingParam.resolve(bookingParams);
      });
    }

    qBookingParam.promise.then(function(bookingParams) {
      getRoomData(propertyCode, roomCode, bookingParams).then(function(data) {
        $scope.updateHeroContent($window._.filter(data[0].images, {includeInSlider: true}));
        // Tracking products impressions
        chainService.getChain(Settings.API.chainCode).then(function(chainData) {
          propertyService.getPropertyDetails(propertyCode).then(function(propertyData){
            if(data[1].products){
              //google analytics
              dataLayerService.trackProductsImpressions(data[1].products.map(function(p){
                return {
                  name: p.name,
                  id: p.code,
                  price: (p.price.totalBaseAfterPricingRules/numNights).toFixed(2),
                  quantity: numNights,
                  dimension2: chainData.nameShort,
                  brand: propertyData.nameLong,
                  dimension1: propertyData.nameShort,
                  list: 'Room',
                  category: data[0].name
                };
              }));
              //Mobius tracking
              $scope.$watch('currentOrder', function(order) {
                if(order && angular.isDefined(order)){
                  mobiusTrackingService.trackSearch(bookingParams, chainData, propertyData, data[1].products, data[0], order);
                }
              });

            }
          });
        });


        qRoomData.resolve({
          roomDetails: data[0],
          roomProductDetails: data[1]
        });
      }, function(err) {
        qRoomData.reject(err);
      });
    });

    return qRoomData.promise;
  };

  function getRoomData(propertyCode, roomCode, bookingParams){
    return $q.all([
      propertyService.getRoomDetails(propertyCode, roomCode),
      propertyService.getRoomProducts(propertyCode, roomCode, bookingParams)
    ]);
  }
});
