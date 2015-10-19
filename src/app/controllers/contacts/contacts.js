'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.contacts', [])

  .controller('ContactsCtrl', function($scope, $controller, chainService, Settings,
   breadcrumbsService, formsService, metaInformationService, $location, propertyService){

    $controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Contact And Feedback');

    $scope.subjectOptions = Settings.UI.forms.contactSubjects;
    $scope.viewSettings = Settings.UI.viewsSettings.contacts;
    $scope.hotelDetails = Settings.UI.hotelDetails;
    var formDataCopy = {
      'code': 'contact',
      'fields': {}
    };
    $scope.formData = angular.copy(formDataCopy);

    var chainCode = Settings.API.chainCode;
    // Get Map data
    if($scope.viewSettings.hasMap){
      propertyService.getPropertyDetails(chainCode)
      .then(function(details){
        $scope.details = details;
      });
    }
    
    //get contact information
    chainService.getChain(chainCode).then(function(chain) {
      $scope.chain = chain;

      $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      $scope.chain.meta.microdata.og['og:title'] = 'Contact: ' + $scope.chain.meta.microdata.og['og:title'];
      $scope.chain.meta.microdata.og['og:description'] = 'Contact: ' + $scope.chain.meta.microdata.og['og:description'];
      metaInformationService.setOgGraph($scope.chain.meta.microdata.og);
    });
    //get form structure and default field values
    formsService.getContactForm().then(function(response) {
      if(response) {
        $scope.formData.fields.subject = response.schema.subject.default;
      }
    });

    $scope.sendForm = function(){
      $scope.form.$submitted = true;
      if ($scope.form.$valid) {
        formsService.sendContactForm($scope.formData).then(function () {
          $scope.formData = angular.copy(formDataCopy);
          $scope.form.$setPristine();
          $scope.showErrorMsg = false;
          $scope.isSent = true;
        }, function () {
          $scope.showErrorMsg = true;
        });
      }
    };
  });
