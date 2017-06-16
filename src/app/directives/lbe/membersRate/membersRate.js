'use strict';

/**
 * Directive to encapsulate member rate boxes.
 *
 * The directive has 2 different types, small and large, passed by the attribute size
 * for example <members-rate size="small"> can be used when only 30% of the screen is available
 * Typically the small should be used for between 30% - 50% screen width and large for 50% up as these
 * have been tested with the default styles.
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.membersRate', [])
    .directive('membersRate', ['Settings', '$log', '_', '$window', 'propertyService', MembersRate]);

  function MembersRate(Settings, $log, _, $window, propertyService) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/membersRate/membersRate.html',
      link: function (scope, elem, attr) {
        var config = Settings.UI.membersRate;
        if (!config) {
          $log.warn('No config for the members rate directive was provided!');
        }

        var size = attr.size || config.defaultSize;
        if(! _.contains(size, ['small', 'large'])) {
          $log.warn('Invalid size attribute passed to the members rate directive');
        }

        scope.sizeClass = 'members-rates__size-' + size;
        // @todo add logic to handle multi properties
        scope.memberRates = [];
        if (Settings.UI.generics.singleProperty) {
          propertyService.getAll()
            .then(function (data) {
              scope.membersRateProperties = data;
              console.log('data', data);
              scope.memberRates = [{
                name: data[0].nameShort,
                tagline: data[0].descriptionShort,
                memberRate: null,
                publicRate: null
              }];
              propertyService.getRooms(Settings.UI.generics.defaultPropertyCode)
                .then(function (rooms) {
                  var top = -1;
                  var selectedRoom = rooms[0];
                  _.each(rooms, function (room) {
                    if (room.weighting > top) {
                      selectedRoom = room;
                      top = room.weighting;
                    }
                  });
                  var params = {
                    adults: 1,
                    children: 0,
                    propertySlug: scope.membersRateProperties[0].meta.slug,
                    propertyCode: scope.membersRateProperties[0].code,
                    productGroupId: 1,
                    from: $window.moment.tz
                  };
                  var startDate = new Date();
                  var endDate = new Date();
                  endDate.setDate(endDate.getDate() + 1);
                  startDate = $.datepicker.formatDate('yy-mm-dd', new Date(startDate), {});
                  endDate = $.datepicker.formatDate('yy-mm-dd', new Date(endDate), {});
                  params.from = startDate;
                  params.to = endDate;
                  propertyService.getRoomProducts(Settings.UI.generics.defaultPropertyCode, selectedRoom.code, params)
                    .then(function (products) {
                      console.log('products', products);
                      var highestPrice = products.products[0].price.totalBaseAfterPricingRules;
                      _.each(products.products, function (product) {
                        if (product.price.totalBaseAfterPricingRules > highestPrice) {
                          highestPrice = product.price.totalBaseAfterPricingRules;
                        }
                        if (product.memberOnly) {
                          scope.memberRates[0].memberRate = product.price.totalBaseAfterPricingRules;
                        }
                      });
                      scope.memberRates[0].publicRate = highestPrice;
                      scope.rooms = scope.memberRates;
                      console.log('members rates', scope.memberRates);
                    });
                });
            });
        }

      }
    };
  }
}());


