'use strict';
/**
 * Filter for wraping part of a string in strong tag
 * used for styling page headings - Logic is, if string contains 1 word the word is bold, if string contains 2 words the second one is bold, if string contains more than 2 words the first 2 are light the rest is bold.
 */

angular.module('mobiusApp.filters.mainHeaderStyle', [])

.filter('mainHeaderStyle' , function(Settings) {
  function filter(input) {
    if(!input){
      return '';
    }else if(Settings.UI.generics.disableMainHeaderStyle){
      return input;
    }

    var words = input.split(' ');
    var len = words.length;

    if(len === 1){
      words[0] = '<strong>' + words[0] + '</strong>';
    }
    else if(len === 2){
      words[1] = '<strong>' + words[1] + '</strong>';
    }
    else{
      words[2] = '<strong>' + words[2];
      words[words.length-1] = words[words.length-1] + '</strong>';
    }

    return words.join(' ');
  }

  return filter;
});
