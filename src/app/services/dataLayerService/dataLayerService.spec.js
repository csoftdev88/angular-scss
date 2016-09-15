'use strict';

describe('dataLayerService', function() {
  var _$window, _dataLayerService;

  var PRODUCTS =  [{code: 'code'}];

  beforeEach(function() {
    module('mobiusApp.services.dataLayer', function($provide) {
      $provide.value('stateService', {
        getCurrentCurrency: sinon.stub().returns({symbol: '$'})
      });

      $provide.value('$window', {
        dataLayer: {
          push: sinon.spy()
        }
      });

      $provide.value('Settings', {
        'googleTagManager': {
          'enable': true,
          'trackUserId': true
        }
      });
    });
  });

  beforeEach(inject(function($window, dataLayerService) {
    _$window = $window;
    _dataLayerService = dataLayerService;
  }));

  describe('setUserId', function() {
    it('should push userId to dataLayer', function() {
      _dataLayerService.setUserId(123);

      expect(_$window.dataLayer.push.calledOnce);
      expect(_$window.dataLayer.push.calledWith({
        'userId' : 123,
        'event' : 'authentication'
      }));
    });
  });

  describe('trackProductsImpressions', function() {
    it('should push products impression event', function() {

      _dataLayerService.trackProductsImpressions(PRODUCTS);

      expect(_$window.dataLayer.push.calledOnce);
      expect(_$window.dataLayer.push.calledWith({
        currencyCode: '$',
        ecommerce: {
          impressions: PRODUCTS
        }
      }));
    });
  });

  describe('trackProductClick', function() {
    it('should push product click event', function() {

      _dataLayerService.trackProductClick(PRODUCTS[0]);

      expect(_$window.dataLayer.push.calledOnce);
      expect(_$window.dataLayer.push.calledWith({
        event: 'productClick',
        ecommerce: {
          click: {
            products: [PRODUCTS[0]]
          }
        }
      }));
    });
  });


  describe('trackProductsDetailsView', function() {
    it('should push products details view event', function() {

      _dataLayerService.trackProductsDetailsView(PRODUCTS);

      expect(_$window.dataLayer.push.calledOnce);
      expect(_$window.dataLayer.push.calledWith({
        ecommerce: {
          detail: {
            products: PRODUCTS
          }
        }
      }));
    });
  });

  describe('trackProductsCheckout', function() {
    it('should push products checkout event', function() {

      _dataLayerService.trackProductsCheckout(PRODUCTS);

      expect(_$window.dataLayer.push.calledOnce);
      expect(_$window.dataLayer.push.calledWith({
        event: 'checkout',
        ecommerce: {
          checkout: {
            products: PRODUCTS
          }
        }
      }));
    });
  });

  describe('trackProductsPurchase', function() {
    it('should push products purchase event', function() {

      _dataLayerService.trackProductsPurchase(PRODUCTS, 'action');

      expect(_$window.dataLayer.push.calledOnce);
      expect(_$window.dataLayer.push.calledWith({
        ecommerce: {
          purchase: {
            actionField: 'action'
          },
          products: PRODUCTS
        }
      }));
    });
  });

  describe('trackReservationRefund', function() {
    it('should push reservation refund event', function() {

      _dataLayerService.trackReservationRefund('testCode');

      expect(_$window.dataLayer.push.calledOnce);
      expect(_$window.dataLayer.push.calledWith({
        ecommerce: {
          refund: {
            actionField: {
              id: 'testCode'
            }
          }
        }
      }));
    });
  });


});
