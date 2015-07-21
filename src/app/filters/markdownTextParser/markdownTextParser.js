'use strict';
/**
 * Filter for formating text coming from markdown editor in admin
 * used for styling headers etc..
 */

angular.module('mobiusApp.filters.markdownTextParser', [])

.filter('markdownTextParser' , function() {
  function filter(input) {

    if(!input){
      return '';
    }

    //format headings
    /*
    angular.element(input).find('h1').each(function(){
      var txt = angular.element(this).html();
      var ar = txt.split(' ');
      var len = ar.length;
      var first = ar.shift();
      var second = len > 2 ? ar.shift(): '';
      var wrapped = '<strong>' + ar.join(' ') + '</strong>';
      angular.element(this).html(len > 2 ? (first + ' ' + second + ' ' + wrapped) : (first + ' ' + wrapped));
      console.log(angular.element(input).find(angular.element(this)).html());
    });
    */


    return input;

  }

  return filter;

});
