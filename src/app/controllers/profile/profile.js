/*
 * This module controlls profile page
 */
(function () {
  'use strict';

  angular
    .module('mobius.controllers.profile', [])
    .controller('ProfileCtrl', Profile);

  function Profile($scope, $controller, $state, breadcrumbsService, contentService, apiService, userObject, user,
                   $timeout, _, chainService, metaInformationService, $location, Settings, propertyService,
                   scrollService){

    //check if user is logged in
    function onAuthorized() {
      if (!$scope.auth.isLoggedIn()) {
        $state.go('home');
      }
    }

    $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

    // If we are using keystone, the alternative keystoneProfile layout will be used that contains
    // the keystone-profile div. We now need to tell keystone to inject the profile page into it
    if (Settings.authType === 'keystone' && window.KS && window.KS.$event) {
      window.KS.$event.emit('parent.content.loaded');
    }

    //Add breadcrumb
    breadcrumbsService.addBreadCrumb('Profile');

    $scope.submitted = false;

    //Config
    $scope.config = Settings.UI.profilePage;
    if($scope.config.displaySummary){
      $scope.showSummary = true;
    }
    $scope.shareURL = $location.protocol() + '://' + $location.host();
    $scope.shareConfig = Settings.UI.shareLinks;

    //get meta information
    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;

      $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      $scope.chain.meta.microdata.og['og:title'] = 'Profile: ' + $scope.chain.meta.microdata.og['og:title'];
      $scope.chain.meta.microdata.og['og:description'] = 'Profile: ' + $scope.chain.meta.microdata.og['og:description'];

      metaInformationService.setPageTitle(chain.meta.pagetitle);
      metaInformationService.setMetaDescription(chain.meta.description);
      metaInformationService.setMetaKeywords(chain.meta.keywords);
      metaInformationService.setOgGraph($scope.chain.meta.microdata.og);

      $timeout(function(){
        scrollService.scrollTo('profile-page');
      }, 500);

    });

    contentService.getTitles().then(function(data) {
      $scope.profileTitles = data;
    });

    contentService.getContactMethods().then(function(data) {
      $scope.profileContacts = data;
    });

    contentService.getCountries().then(function(data) {
      $scope.profileCountries = data;
    });

    //Get property details for map
    if($scope.config.displayMap){
      propertyService.getAll().then(function(properties){
        var code = properties[0].code;
        propertyService.getPropertyDetails(code).then(function(details){
          $scope.propertyDetails = details;
        });
      });
    }

    $timeout(function(){
      $scope.profileData = user.getUser();
      $scope.profileData.userCountry = contentService.getCountryByID($scope.profileData.localeCode, $scope.profileCountries);
    }, 2000);

    $scope.update = function(form, profileData){
      $scope.submitted = true;
      clearErrorMsg();
      if(form.$valid){
        var data = _.omit(profileData, _.isNull);
        data = _.omit(data, ['id','token','email', 'languageCode']);

        data.userCountry = contentService.getCountryByID(data.localeId, $scope.profileCountries);

        if(data.userCountry) {
          data.country = data.userCountry.code;
          data.localeCode = data.userCountry.code;
        }

        apiService.put(apiService.getFullURL('customers.customer', {customerId: userObject.id}), data).then(function(){
          userObject = _.extend(userObject, data);
          $scope.success = true;
          if($scope.config.displaySummary){
            $scope.showSummary = true;
          }
        }, function(){
          $scope.error = true;
          $scope.genericError = true;
        });
      }
      else{
        $scope.missingFieldsError = true;
      }
    };

    $scope.savePassword = function(form, passwordData){
      form.$submitted = true;
      if(form.$valid){
        var data = {
          'token': userObject.token,
          'password': passwordData.password
        };
        apiService.post(apiService.getFullURL('customers.changePassword', {customerId: userObject.id}), data).then(function(){
          clearErrorMsg();
          userObject = _.extend(userObject, data);
          $scope.passwordResetSuccess = true;
          if($scope.config.displaySummary){
            $scope.showSummary = true;
          }
        }, function(err){
          $scope.errorCode = err.error.reason;
          $scope.passwordResetError = true;
        });
      }
      else{
        $scope.passwordResetError = true;
        $scope.passwordFormError = true;
      }
    };

    function clearErrorMsg(){
      $scope.error = false;
      $scope.success = false;
      $scope.genericError = false;
      $scope.missingFieldsError = false;
      $scope.submitted = false;
    }

    $scope.scrollToForm = function(){
      scrollService.scrollTo('profile-form', 20);
    };

  }

}());
