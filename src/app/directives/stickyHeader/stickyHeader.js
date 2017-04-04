'use strict';

angular.module('mobiusApp.directives.stickyHeader', [])
    .directive('stickyHeader', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var stick = function () {
                    var offset = $(window).scrollTop();
                    var el = $(element);
                    var elOffset = el.position().top;
                    if (offset > elOffset) {
                        el.addClass('sticky-header');
                    } else {
                        if (offset <= elOffset) {
                            el.removeClass('sticky-header');
                        }
                    }
                };
                $($window).scroll(stick);
            }
        };
    }]);