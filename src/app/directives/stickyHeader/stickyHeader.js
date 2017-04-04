'use strict';
/**
 * Directive to allow adding the sticky-header attr to a HTML
 * element to make the element stick to the top once the page
 * has scrolled past its element.
 */
angular.module('mobiusApp.directives.stickyHeader', [])
    .directive('stickyHeader', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var stick = function () {
                    // Determine the amount the page has scrolled down
                    var offset = $(window).scrollTop();
                    var el = $(element);
                    // Determine the position of the element
                    var elOffset = el.position().top;
                    // If the page has scrolled below the element, attach
                    // the style class to make the element sticky
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