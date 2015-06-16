'use strict';
/*
*  Controller for hotel details page with a list of rooms
*/
angular.module('mobius.controllers.hotel.details', [])

.controller( 'HotelDetailsCtrl', function($scope, bookingService,
  propertyService, filtersService, preloaderFactory) {

  var mock = {
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
            }
          ]
        }
      ]
    }
  };

  var bookingParams = bookingService.getAPIParams();
  // Include the amenities
  bookingParams.includes = 'amenities';

  var propertyCode = bookingParams.property;
  delete bookingParams.property;

  function getAvailableRooms(propertyCode, params){
    // NOTE: In case when productGroupId is not presented in
    // bookingParams - property details are returned without
    // availability details
    var promise = propertyService.getPropertyDetails(propertyCode, params)
      .then(function(details){
        $scope.details = mock;//details;
        // Updating Hero content images
        if(details.previewImages){
          var heroContent =  details.previewImages.map(function(src){
            return {'image': src};
          });

          $scope.updateHeroContent(heroContent);

          if(angular.isDefined(details.lat) && angular.isDefined(details.long)){
            $scope.position = [details.lat, details.long];
          }
        }
      });

    preloaderFactory(promise);
  }

  // In order to get rooms availability we must call the API with productGroupId
  // param which is presented as rate parameter set by a bookingWidget
  if(bookingParams.productGroupId){
    getAvailableRooms(propertyCode, bookingParams);
  } else{
    // productGroupId is not set by the widget - getting default BAR
    filtersService.getBestRateProduct().then(function(brp){
      if(brp){
        bookingParams.productGroupId = brp.id;
      }

      getAvailableRooms(propertyCode, bookingParams);
    });
  }
});
