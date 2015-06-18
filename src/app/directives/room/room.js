'use strict';

angular.module('mobiusApp.directives.room', [])

.directive('room', function($stateParams, $window, Settings,
  bookingService, propertyService, filtersService, preloaderFactory) {
  return {
    restrict: 'E',
    templateUrl: 'directives/room/room.html',
    // Widget logic goes here
    link: function(scope){

      /** MOCK START */

      var hotelMock = {
        'id': 42,
        'IRI': '/properties/ABB/',
        'code': 'ABB',
        'chainCode': 'SAN',
        'regionCode': 'BC',
        'locationCode': 'VAN',
        'nameShort': 'Abbotsford',
        'nameLong': 'Hotel & Suites Abbotsford',
        'description': 'Ideally located, this hotel is just steps away from the city center’s most popular malls, businesses and local attractions.',
        'address1': '32720 Simon Avenue',
        'address2': null,
        'address3': null,
        'city': 'Abbotsford',
        'zip': 'V2T 0B8',
        'tel1': '604 556 7263',
        'tel2': null,
        'fax': '604 556 7253',
        'email': 'reservations@client.com',
        'URI': 'http://www.client.com/hotels/abbotsford/',
        'distanceFrom': 158.5,
        'lat': 49.053213,
        'long': -122.315465,
        'priceFrom': 158.5,
        'priceTo': 198,
        'tripAdvisorRating': 4,
        'pointsFrom': 1580,
        'localInfo': {
          'temperatureC': 19,
          'temperatureF': 66,
          'localTime': '14:00',
          'localTimeZone': 'PST',
          'weather': 'rain',
          'weatherIcon': 'http://www.images.com/default11.jpg'
        },
        'directions': [
          {
            'name': 'car',
            'description': 'lorem',
            'icon': 'http://www.images.com/default11.jpg'
          },
          {
            'name': 'train',
            'description': 'lorem',
            'icon': 'http://www.images.com/default11.jpg'
          },
          {
            'name': 'tram',
            'description': 'lorem',
            'icon': 'http://www.images.com/default11.jpg'
          }
        ],
        'rating': 3,
        'policies': {
          'Cancel': 'SAME DAY 4PM',
          'Commission': '5% Commission',
          'Guarantee': 'Default Guarantee ',
          'Tax': 'PST(8%)+GST(5%)',
          'Family': 'Default Family ',
          'Pet': 'Pets Allowed ($20)',
          'ExtraGuests': 'Extra Guest ($10)',
          'CheckInOut': '4PM-11AM',
          'NoShow': 'Default No Show '
        },
        'locale': 'CAN-BC',
        'chain': 'Client Hotels & Inns',
        'rolloverZone': -8,
        'rolloverTime': '22:00:00',
        'amenities': [
          {
            'name': '24-hour coffee shop',
            'icon': 'http://www.images.com/default11.jpg'
          },
          {
            'name': 'Parking',
            'icon': 'http://www.images.com/default11.jpg'
          }
        ],
        'businessServices': [
          'Audio visual equipment',
          'Blackboard'
        ],
        'views': [
          'City view',
          'Forest view'
        ],
        'previewImages': [
          'http://www.images.com/default11-thumb.jpg'
        ],
        'images': [
          {
            'uri': 'http://www.images.com/default11.jpg',
            'alt': 'picture1'
          },
          {
            'uri': 'http://www.images.com/default12.jpg',
            'alt': 'picture2'
          }
        ],
        'available': true,
        'availability': {
          'rooms': [
            {
              'name': 'Queen Room',
              'description': 'Lorem Ipsum',
              'code': 'QWN',
              'IRI': '/properties/ABB/rooms/QWN',
              'priceFrom': 169,
              'images': [
                {
                  'URI': 'http://www.images.com/default11.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 5,
                  'thumbnailURI': 'http://www.images.com/default11-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                },
                {
                  'URI': 'http://www.images.com/default12.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 4,
                  'thumbnailURI': 'http://www.images.com/default12-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                }
              ]
            },
            {
              'name': 'Queen plus Room',
              'description': 'Lorem Ipsum',
              'code': 'QPR',
              'IRI': '/properties/ABB/rooms/QWN',
              'priceFrom': 189,
              'images': [
                {
                  'URI': 'http://www.images.com/default11.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 5,
                  'thumbnailURI': 'http://www.images.com/default11-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                },
                {
                  'URI': 'http://www.images.com/default12.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 4,
                  'thumbnailURI': 'http://www.images.com/default12-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                }
              ]
            },
            {
              'name': 'Deluxe Plus Room',
              'description': 'Lorem Ipsum',
              'code': 'DPR',
              'IRI': '/properties/ABB/rooms/QWN',
              'priceFrom': 269,
              'images': [
                {
                  'URI': 'http://www.images.com/default11.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 5,
                  'thumbnailURI': 'http://www.images.com/default11-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                },
                {
                  'URI': 'http://www.images.com/default12.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 4,
                  'thumbnailURI': 'http://www.images.com/default12-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                }
              ]
            },
            {
              'name': 'Presidential Room',
              'description': 'Lorem Ipsum',
              'code': 'PRR',
              'IRI': '/properties/ABB/rooms/QWN',
              'priceFrom': 1690,
              'images': [
                {
                  'URI': 'http://www.images.com/default11.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 5,
                  'thumbnailURI': 'http://www.images.com/default11-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                },
                {
                  'URI': 'http://www.images.com/default12.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 4,
                  'thumbnailURI': 'http://www.images.com/default12-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                }
              ]
            },
            {
              'name': 'UltraDelux Room',
              'description': 'Lorem Ipsum',
              'code': 'UDX',
              'IRI': '/properties/ABB/rooms/QWN',
              'priceFrom': 569,
              'images': [
                {
                  'URI': 'http://www.images.com/default11.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 5,
                  'thumbnailURI': 'http://www.images.com/default11-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                },
                {
                  'URI': 'http://www.images.com/default12.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 4,
                  'thumbnailURI': 'http://www.images.com/default12-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                }
              ]
            },
            {
              'name': 'Deluxe Room',
              'description': 'Lorem Ipsum',
              'code': 'DLX',
              'IRI': '/properties/ABB/rooms/DLX',
              'priceFrom': 199,
              'images': [
                {
                  'URI': 'http://www.images.com/default11.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 5,
                  'thumbnailURI': 'http://www.images.com/default11-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                },
                {
                  'URI': 'http://www.images.com/default12.jpg',
                  'width': 250,
                  'height': 200,
                  'order': 4,
                  'thumbnailURI': 'http://www.images.com/default12-thumb.jpg',
                  'thumbnailWidth': 50,
                  'thumbnailHeight': 50
                },

              ]
            }
          ]
        }
      };

      /** MOCK END */

      var bookingParams = bookingService.getAPIParams();

      var propertyCode = bookingParams.property;
      scope.propertyCode = propertyCode;
      delete bookingParams.property;

      var roomCode = $stateParams.roomID;

      // Getting room details
      var roomDetailsPromise = propertyService.getRoomDetails(propertyCode, roomCode).then(function(data){
        // Inherited from RoomDetailsCtrl
        scope.setRoomDetails(data);

        // Updating hero slider images
        var heroContent =  data.images.map(function(image){
          return {'image': image.URI};
        });

        scope.updateHeroContent(heroContent);

        /* Getting other rooms. We should show those that are closest in price but have a price that is
           greater than the currently viewed room. If there are not enough of them we can show the cheaper
           ones as well. */
        var hotelRooms = hotelMock.availability.rooms;

        var moreExpensiveRooms = hotelRooms.filter(function(room) {return room.priceFrom > data.priceFrom;});
        var cheaperOrEqualRooms = hotelRooms.filter(function(room) {return room.priceFrom <= data.priceFrom && room.code !== roomCode;});

        var sortedMoreExpensiveRooms = moreExpensiveRooms.sort(function(a, b) { return a.priceFrom - b.priceFrom;});

        // sortedCheaperRooms is sorted by price in descending order
        var sortedCheaperOrEqualRooms = cheaperOrEqualRooms.sort(function(a, b) { return b.priceFrom - a.priceFrom;});

        scope.otherRooms = sortedMoreExpensiveRooms.concat(sortedCheaperOrEqualRooms).slice(0,3);
        debugger;
      });

      preloaderFactory(roomDetailsPromise);

      // Room product details
      function getRoomProductDetails(propertyCode, roomCode, params){
        propertyService.getRoomProductDetails(propertyCode, roomCode, params).then(function(data){
          scope.products = data.products;

          scope.accordionStates = data.products.map(function(){
            return false;
          });

          selectBestProduct();
        });
      }

      scope.onSelectProduct=function(product){
        if(product === scope.selectedProduct){
          return;
        }

        // NOTE: Product must be always selected
        var productIndex = scope.products.indexOf(product);
        if(productIndex!==-1){
          scope.accordionStates[productIndex] = true;
          // NOTE: This function is inherited from RoomDetailsCtrl
          scope.selectProduct(product);
        }
      };

      function selectBestProduct(){
        // Note: Currently BAR doesn't have code provided so we are matching name against our settings
        // This should be fixed later on the API side.
        var bestProduct = $window._.findWhere(scope.products,
          {name: Settings.bestAvailableRateCode}
        );

        if(bestProduct){
          scope.onSelectProduct(bestProduct);
        }
      }

      if(bookingParams.productGroupId){
        getRoomProductDetails(propertyCode, roomCode, bookingParams);
      } else{
        // productGroupId is not set by the widget - getting default BAR
        filtersService.getBestRateProduct().then(function(brp){
          if(brp){
            bookingParams.productGroupId = brp.id;
          }

          getRoomProductDetails(propertyCode, roomCode, bookingParams);
        });
      }
    }
  };
});
