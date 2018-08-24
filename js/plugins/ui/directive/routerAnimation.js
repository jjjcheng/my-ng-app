'use strict';

angular.module('app.plugins').directive('routerAnimation', function($rootScope, $timeout, $state) {
    return {
        restrict: 'A',
        compile: function(element, attributes) {
            element.removeAttr('router-animation data-router-animation');

            element.addClass('router-animation-wrap');

            var $loader = $('<div class="x-loading"><div class="ico-loading"><span class="ico-arrow"></span><span class="ico-arrow"></span><span class="ico-arrow"></span></div><div class="text-loading">加载中...请稍后...</div></div>').hide().appendTo(element);

            // var animateElementSelector = ".x-wrap";
            var viewsToMatch = attributes.routerAnimation.split(/\s/);

            var needRunContentViewAnimEnd = false;

            function contentViewAnimStart() {
                needRunContentViewAnimEnd = true;
                element.addClass('active');
                $loader.fadeIn();

                // $(animateElementSelector).addClass('animated faster fadeOutDown');
            }

            function contentViewAnimEnd() {
                if (needRunContentViewAnimEnd) {
                    element.removeClass('active');

                    // $(animateElementSelector).addClass('animated faster fadeInUp');

                    needRunContentViewAnimEnd = false;

                    $timeout(function() {
                        // $(animateElementSelector).removeClass('animated');
                    }, 10);
                }
                $loader.fadeOut();
            }


            var destroyForStart = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                var isAnimRequired = _.some(viewsToMatch, function(view) {
                    return _.has(toState.views, view) || _.has(fromState.views, view);
                });
                if (isAnimRequired) {
                    contentViewAnimStart()
                }
            });

            var destroyForEnd = $rootScope.$on('$viewContentLoaded', function(event) {
                contentViewAnimEnd();
            });
            var stateChangeCancel=$rootScope.$on('$stateChangeCancel', function(current, previous, rejection) {
                contentViewAnimEnd();
            });

            element.on('$destroy', function() {
                destroyForStart();
                destroyForEnd();
            });
        }
    }
});