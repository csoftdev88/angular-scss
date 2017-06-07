// 'use strict';
//
// /**
//  * Service to request and parse instagram queries for the instagram feed directive.
//  *
//  * This service does not use any authentication so the user's profile you are requesting
//  * must be public. It utilizes instagram's API v2.
//  *
//  * @ref https://www.instagram.com/developer
//  * @see apiService
//  */
// (function() {
//
//   angular
//     .module('mobiusApp.services.instagram', [])
//     .service('instagram', Instagram);
//
//   function Instagram($http, Settings, $log, _) {
//
//     var self = this;
//
//     // Get the config from settings
//     var config = Settings.API.instagram;
//     if (! config) {
//       $log.warn('Potentially unexpected behaviour. No config for instagram was found');
//     }
//
//     var defaultNumImages = config.defaultNumImages;
//     var instagramUrl = 'https://www.instagram.com/';
//
//     /**
//      * Build the URL to query the media endpoint
//      * @param username
//      * @returns {string}
//      */
//     var buildQueryUrl = function (username) {
//       return instagramUrl + username + '/media?callback=JSON_CALLBACK';
//     };
//
//     /**
//      * Transform the API response into the first 10 image URLS
//      * example api response, curl https://www.instagram.com/edweird0/media/
//      * @param numImages
//      * @param res
//      * @returns {Array}
//      */
//     var extractImageUrls = function (numImages, res) {
//       // Get the first X entries
//       var images = res.data.slice(0, numImages);
//       // Return the image url based on the response's json structure
//       return _.filter(images, function (item) {
//         return item.images.thumbnail.url;
//       });
//     };
//
//     /**
//      * Public function used to retrieve instagram image urls
//      * @param numImages
//      * @param username
//      */
//     self.getFeed = function(numImages, username) {
//       username = username || config.username;
//       numImages = numImages || defaultNumImages;
//
//       var instagramPromise = $http.jsonp(buildQueryUrl(username));
//       instagramPromise.then(function (res) {
//         $log.info('Instagram API request success.', res);
//         return extractImageUrls(numImages, res);
//       }, function (err) {
//         $log.warn('Instagram API request failed. Was the username valid?', err);
//         return [];
//       });
//       return instagramPromise;
//     };
//
//   }
//
// }());
