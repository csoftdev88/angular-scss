'use strict';
/*
 * This module controlls profile page
 */
angular.module('mobius.controllers.profile', [])

  .controller('ProfileCtrl', function($scope, $controller, $state, breadcrumbsService, contentService, apiService, userObject, user, $timeout, _, chainService, metaInformationService, $location, Settings, propertyService, scrollService){

    //check if user is logged in
    function onAuthorized(){
      if(!user.isLoggedIn()){
        $state.go('home');
      }
    }
    $controller('AuthCtrl', {$scope: $scope, config: {onAuthorized: onAuthorized}});

    //Add breadcrumb
    breadcrumbsService.addBreadCrumb('Profile');

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

    });

		contentService.getTitles().then(function(data) {
			$scope.profileTitles = data;
		});

		contentService.getContactMethods().then(function(data) {
			$scope.profileContacts = data;
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
    
		$controller('ISOCountriesCtrl', {$scope: $scope});

		$timeout(function(){
      $scope.profileData = user.getUser();
    }, 2000);

		$scope.update = function(form, profileData){
			form.$submitted = true;
		  if(form.$valid){
				var data = _.omit(profileData, _.isNull);
				data = _.omit(data, ['id','token','email']);
				
		    apiService.put(apiService.getFullURL('customers.customer', {customerId: userObject.id}), data).then(function(){
		      clearErrorMsg();
		      userObject = _.extend(userObject, data);
		      setErrorMsg('Thank you, your profile has been updated', 'success');
          if($scope.config.displaySummary){
            $scope.showSummary = true;
          }
		    }, function(){
		      //TODO: Move into locale
		      setErrorMsg('Sorry, there was an error, please try again', 'error');
		    });
		  }
		  else{
		    setErrorMsg('Please fill out all the fields indicated', 'error');
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

		function setErrorMsg(msg, type){
			if(type === 'error'){
				$scope.errorMsg = msg;
			}
			else{
				$scope.successMsg = msg;
			}
	  }

	  function clearErrorMsg(){
	    $scope.errorMsg = null;
	    $scope.successMsg = null;
	  }

    $scope.scrollToForm = function(){
      scrollService.scrollTo('profile-form', 20);
    };

  });
