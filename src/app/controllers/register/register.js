'use strict';
/*
 * This module controlls register page
 */
angular.module('mobius.controllers.register', [])

  .controller('RegisterCtrl', function($scope, $controller, $timeout, $state, scrollService, breadcrumbsService,
                                       contentService, apiService, userObject, user, chainService,
                                       metaInformationService, $location, Settings, _){

    breadcrumbsService.addBreadCrumb('Register');

    $scope.config = Settings.UI.registerPage;
    $scope.submitted = false;
    $scope.registerData = {};

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
        scrollService.scrollTo('jsRegister');
      }, 500);

    });

		contentService.getTitles().then(function(data) {
			$scope.registerTitles = data;
		});

		contentService.getContactMethods().then(function(data) {
			$scope.registerContacts = data;
		});

    contentService.getCountries().then(function(data) {
      $scope.registerCountries = data;
    });

		$scope.register = function(form, registerData){
      clearErrorMsg();
			$scope.submitted = true;
		  if (form.$valid) {
        if (registerData.localeId && angular.isDefined($scope.registerCountries)) {
          var selectedCountry = _.find($scope.registerCountries, function(country) {
            return country.id === registerData.localeId;
          });

          registerData.localeCode = selectedCountry && selectedCountry.code;
        }
        if (Settings.API.sendAcceptedTermsAndConditions) {
          registerData.termsAndConditionsAccepted = (registerData.termsAndConditionsAccepted) ? true : false;
        }
        // Make sure any previous user session data is cleared before registering
        user.clearStoredUser();
		    apiService.post(apiService.getFullURL('customers.register'), registerData).then(function(response){
		      userObject.id = response.id;
		      user.loadProfile();
		      $state.go('home');
		    }, function(err){
		      if(err.error.msg === 'User already registered'){
            $scope.userRegisteredError = true;
            $scope.error = true;
          }
          else{
            $scope.genericError = true;
            $scope.error = true;
          }
		    });
		  }
		  else{
		    $scope.missingFieldsError = true;
        $scope.error = true;
		  }
		};

	  function clearErrorMsg(){
	    $scope.error = false;
	    $scope.userRegisteredError = false;
      $scope.genericError = false;
      $scope.missingFieldsError = false;
      $scope.submitted = false;
	  }


  });
