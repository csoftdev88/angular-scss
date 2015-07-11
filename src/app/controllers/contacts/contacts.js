'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.contacts', [])

  .controller('ContactsCtrl', function($scope, $controller, chainService, Settings,
   breadcrumbsService, formsService){

    $controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Contact And Feedback');

    $scope.subjectOptions = Settings.UI.forms.contactSubjects;
    var formDataCopy = {
      'code': 'contact',
      'fields': {}
    };
    $scope.formData = angular.copy(formDataCopy);
    
    //get contact information
    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;
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
