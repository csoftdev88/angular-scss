'use strict';

angular.module('mobiusApp.filters.cloudinaryImage', [])

  .filter('cloudinaryImage', function() {
    function filter(input, width, height, crop) {
      if (input && input.indexOf('cloudinary.com/') > -1) {
        var replaceString = [];
        if (width) {
          replaceString.push('w_' + width);
        }
        if (height) {
          replaceString.push('h_' + height);
        }
        if (replaceString.length) {
          if (crop) {
            replaceString.push('c_' + crop);
          } else {
            replaceString.push('c_scale');
          }
          var inputParts = input.split('/');
          replaceString.push('q_auto,f_auto');
          if((inputParts[6].indexOf('w_') === 0) || (inputParts[6].indexOf('h_') === 0) || (inputParts[6].indexOf('c_') === 0)) {
            inputParts.splice(6, 1, replaceString.join(',')); // replace
          } else {
            inputParts.splice(6, 0, replaceString.join(',')); // insert
          }
          //Add q_auto and f_auto segments
          //inputParts.splice(7, 0, 'q_auto,f_auto');
          input = inputParts.join('/');
        }
      }
      return input;
    }

    return filter;
  })
;
