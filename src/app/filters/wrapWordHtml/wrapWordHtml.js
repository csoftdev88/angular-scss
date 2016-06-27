'use strict';
/*
 * Simple string truncate filter
 */
angular.module('mobiusApp.filters.wrapword', [])

.filter('wrapWordHtml' , function(_) {
  function filter(input, tag, index, pattern, ignore) {
    if(!input){
      return '';
    }

    if(ignore){
      return input;
    }

    var ar = input.split(' ');

    if(pattern){

      //find out how many words to wrap
      var numToWrap = 0;
      _.each(pattern, function(val,key) {
        numToWrap = ar.length > parseInt(key, 10) ? val : numToWrap;
      });

      //if 1 word to wrap, wrap it!
      if(numToWrap === 1){
        ar[index] = '<' + tag + '>' + ar[index] + '</' + tag + '>';
      }
      //if more than 1 word to wrap, add opening/closing tags in correct place
      else if(numToWrap !== 0){
        //opening tag
        ar[index] = '<' + tag + '>' + ar[index];
        //closing tag
        ar[index+numToWrap-1] = ar[index+numToWrap-1] + '</' + tag + '>';
      }
      
    }
    else{
      var wrapped = '<' + tag + '>' + ar[index] + '</' + tag + '>';
      ar[index] = wrapped;
    }

    return ar.join(' ');

  }

  return filter;
});
