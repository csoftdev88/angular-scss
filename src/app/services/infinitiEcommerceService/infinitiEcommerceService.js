'use strict';
/*
 * This service handles mobius rate search and product purchase tracking
 */
angular.module('mobiusApp.services.infinitiEcommerceService', [])
  .service( 'infinitiEcommerceService',  function(Settings, apiService, cookieFactory, _, $rootScope, userObject) {

    //Create customer info data if anon
    function getCustomerInfo(purchaseData){

      //Create array of phone numbers
      var customerPhones = [];
      var phoneNumber = {'value': purchaseData.customer.phone};
      customerPhones.push(phoneNumber);
      if(purchaseData.customer.secondPhoneNumber){
        phoneNumber = {'value': purchaseData.customer.secondPhoneNumber};
        customerPhones.push(phoneNumber);
      }

      var customerInfo = {
          'name':{
             'title': purchaseData.customer.title,
             'first': purchaseData.customer.fName,
             'last': purchaseData.customer.lName
          },
          'address':{
             'buildingStreet': purchaseData.customer.address,
             'city': purchaseData.customer.city,
             'zipCode': purchaseData.customer.zip,
             'countryCode': purchaseData.customer.country,
             'isDelivery': false
          },
          'emails':[
             {
                'value': purchaseData.customer.email
             }
          ],
          'phones': customerPhones
        };

      return customerInfo;
    }

    //Create customer loyalty cards data if logged in
    function getCustomerLoyalty(){

      var loyalty = [];
      var cardValues = {
        'number': cookieFactory('CustomerID'),
        'type': userObject.loyalties.loyaltyCard.name
      };
      loyalty.push(cardValues);
      return loyalty;

    }

    //Track purchase
    function trackPurchase(isLoggedIn, purchaseData){

      console.log('trackPurchase isLoggedIn: ' + isLoggedIn);
      console.log('trackPurchase purchaseData: ' + angular.toJson(purchaseData));

      if(!Settings.infinitiEcommerceTracking.enable || !purchaseData){
        return;
      }

      var postData = {
        'transactionID': purchaseData.reservationNumber,
        'cartItems': purchaseData.products
      };

      if(!isLoggedIn){
        postData.customerInfo = getCustomerInfo(purchaseData);
      }
      else{
        postData.loyalty = getCustomerLoyalty();
      }

      console.log('Infiniti E-Commerce Tracking Data: ' + angular.toJson(postData));

      /* global evolution */
      evolution('track', 'purchase', postData);
    }

    // Public methods
    return {
      trackPurchase: trackPurchase
    };

  });
