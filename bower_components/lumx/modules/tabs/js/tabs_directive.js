/* global angular */
'use strict'; // jshint ignore:line


angular.module('lumx.tabs', [])
    .controller('LxTabsController', ['$scope', '$sce', '$timeout', '$window', function($scope, $sce, $timeout, $window)
    {
        var tabs = [],
            links,
            linksContainer,
            tabTags,
            indicator,
            paginationTranslation = 0;

        this.init = function(element)
        {
            links = element.find('.tabs__links');
            linksContainer = links.parent('.tabs');
            tabTags = links.find('.tabs-link');
            indicator = element.find('.tabs__indicator');
        };

        this.getScope = function()
        {
            return $scope;
        };

        this.addTab = function(tabScope)
        {
            tabs.push(tabScope);

            $timeout(function()
            {
                setIndicatorPosition();
            });

            return (tabs.length - 1);
        };

        this.removeTab = function(tabScope)
        {
            var idx = tabs.indexOf(tabScope);

            if (idx !== -1)
            {
                for (var tabIdx = idx + 1; tabIdx < tabs.length; ++tabIdx)
                {
                    --tabs[tabIdx].index;
                }

                tabs.splice(idx, 1);

                if (idx === $scope.activeTab)
                {
                    $scope.activeTab = 0;
                    $timeout(function()
                    {
                        setIndicatorPosition(idx);
                    });
                }
                else if(idx < $scope.activeTab)
                {
                    var old = $scope.activeTab;
                    $scope.activeTab = old - 1;

                    $timeout(function()
                    {
                        setIndicatorPosition(old);
                    });
                }
                else
                {
                    $timeout(function()
                    {
                        setIndicatorPosition();
                    });
                }
            }
        };

        function isPaginationActive()
        {
            var tabsWidth = links.outerWidth();
            var tabsVisibleWidth = linksContainer.outerWidth();

            return tabsWidth > tabsVisibleWidth;
        }

        function getFirstHiddenLeftTab()
        {
            var leftBorderContainer = linksContainer.offset().left;

            var firstTabHidden;

            for (var i = 0; i < tabTags.length; i++)
            {
                var leftBorderTab = angular.element(tabTags[i]).offset().left;

                if (!firstTabHidden && leftBorderTab > (leftBorderContainer - linksContainer.outerWidth()) && leftBorderTab < leftBorderContainer)
                {
                    firstTabHidden = angular.element(tabTags[i]);
                    break;
                }
            }

            return firstTabHidden;
        }

        function getFirstHiddenRightTab()
        {
            var rightBorderContainer = linksContainer.offset().left + linksContainer.outerWidth();

            var firstTabHidden;

            for (var i = 0; i < tabTags.length; i++)
            {
                var tabElement = angular.element(tabTags[i]);
                var rightBorderTab = tabElement.offset().left + tabElement.outerWidth();

                if (!firstTabHidden && rightBorderTab > rightBorderContainer)
                {
                    firstTabHidden = angular.element(tabTags[i]);
                    break;
                }
            }

            return firstTabHidden;
        }

        function getFirstVisibleTab()
        {
            var leftBorderContainer = linksContainer.offset().left;

            var firstTabVisible;

            for (var i = 0; i < tabTags.length; i++)
            {
                var leftBorderTab = angular.element(tabTags[i]).offset().left;
                if (!firstTabVisible && leftBorderTab > leftBorderContainer)
                {
                    firstTabVisible = tabTags[i];
                    break;
                }
            }

            return angular.element(firstTabVisible);
        }

        function isPaginationLeftDisabled ()
        {
            return getFirstHiddenLeftTab() === undefined;
        }

        function isPaginationRightDisabled ()
        {
            return getFirstHiddenRightTab() === undefined;
        }

        function showNextPage()
        {
            var firstTabHidden = getFirstHiddenRightTab();

            var deltaX = linksContainer.offset().left - firstTabHidden.offset().left;

            // Take in account the width of pagination button
            deltaX += 41;

            paginationTranslation += deltaX;

            var transformProperties = {
                translateX: paginationTranslation + 'px'
            };

            var animationProperties = {
                duration: 200
            };

            links.velocity(transformProperties, animationProperties);

            indicator.velocity(transformProperties, animationProperties);

            $timeout(function () {
                $scope.$apply();
            }, 201);
        }

        function showPrevPage()
        {
            var firstTabHidden = getFirstHiddenLeftTab();

            var deltaX = linksContainer.offset().left - firstTabHidden.offset().left;

            // Take in account width of pagination button
            deltaX += 41;

            paginationTranslation += deltaX;

            var transformProperties = {
                translateX: paginationTranslation + 'px'
            };

            var animationProperties = {
                duration: 200
            };

            links.velocity(transformProperties, animationProperties);

            indicator.velocity(transformProperties, animationProperties);

            $timeout(function () {
                $scope.$apply();
            }, 201);
        }

        function repositionPage()
        {
            var leftContainer = linksContainer.offset().left;

            var firstTabVisible = getFirstVisibleTab();

            var deltaX = leftContainer - firstTabVisible.offset().left + 41;

            paginationTranslation += deltaX;

            var transformProperties = {
                translateX: paginationTranslation + 'px'
            };

            var animationProperties = {
                duration: 10
            };

            links.velocity(transformProperties, animationProperties);

            indicator.velocity(transformProperties, animationProperties);

        }

        function getTabs()
        {
            return tabs;
        }

        function setActiveTab(index)
        {
            $timeout(function()
            {
                $scope.activeTab = index;
            });
        }

        function setLinksColor(newTab)
        {
            tabTags.removeClass('tc-' + $scope.indicator);
            tabTags.eq(newTab).addClass('tc-' + $scope.indicator);
        }

        function setIndicatorPosition(oldTab)
        {
            var direction;

            if ($scope.activeTab > oldTab)
            {
                direction = 'right';
            }
            else
            {
                direction = 'left';
            }

            var tabsVisibleWidth = links.parent('.tabs').outerWidth(),
                activeTab = links.find('.tabs-link').eq($scope.activeTab),
                activeTabWidth = activeTab.outerWidth(),
                indicatorLeft = activeTab.position().left,
                indicatorRight = tabsVisibleWidth - (indicatorLeft + activeTabWidth);

            if (angular.isUndefined(oldTab))
            {
                indicator.css({
                    left: indicatorLeft,
                    right: indicatorRight
                });
            }
            else
            {
                var animationProperties = {
                    duration: 200,
                    easing: 'easeOutQuint'
                };

                if (direction === 'left')
                {
                    indicator.velocity({
                        left: indicatorLeft
                    }, animationProperties);

                    indicator.velocity({
                        right: indicatorRight
                    }, animationProperties);
                }
                else
                {
                    indicator.velocity({
                        right: indicatorRight
                    }, animationProperties);

                    indicator.velocity({
                        left: indicatorLeft
                    }, animationProperties);
                }
            }
        }

        $scope.$watch('activeTab', function(newIndex, oldIndex)
        {
            if (newIndex !== oldIndex)
            {
                $timeout(function()
                {
                    setLinksColor(newIndex);
                    setIndicatorPosition(oldIndex);
                });
            }
        });

        // Watch tabs and go to previous page if there is no more tabs currently displayed
        $scope.$watchCollection(function() { return tabs; }, function ()
        {

            $timeout(function ()
            {
                tabTags = links.find('.tabs-link');
            });

            if (isPaginationActive())
            {
                var firstTabVisible = getFirstVisibleTab();

                if (angular.equals(firstTabVisible[0], tabTags[tabTags.length - 1]))
                {
                    showPrevPage();
                }
            }
        });

        angular.element($window).bind('resize', function()
        {
            setIndicatorPosition();

            if (isPaginationActive())
            {
                repositionPage();
            }
        });

        // Public API
        $scope.getTabs = getTabs;
        $scope.setActiveTab = setActiveTab;
        $scope.isPaginationActive = isPaginationActive;
        $scope.isPaginationLeftDisabled = isPaginationLeftDisabled;
        $scope.isPaginationRightDisabled = isPaginationRightDisabled;
        $scope.showNextPage = showNextPage;
        $scope.showPrevPage = showPrevPage;
    }])
    .directive('lxTabs', ['$parse', function($parse)
    {
        return {
            restrict: 'E',
            controller: 'LxTabsController',
            templateUrl: 'tabs.html',
            transclude: true,
            replace: true,
            scope: true,
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element);
                scope.activeTab = 0;
                scope.linksTc = 'dark';
                scope.linksBgc = 'white';
                scope.indicator = 'blue-500';
                scope.zDepth = '0';
                scope.layout = 'full';
                scope.iconPrefix = 'mdi mdi-';

                scope.$watch(function()
                {
                    return 'activeTab' in attrs ? scope.$parent.$eval(attrs.activeTab) : 0;
                }, function(newValue)
                {
                    scope.activeTab = angular.isDefined(newValue) ? newValue : 0;
                });

                if ('activeTab' in attrs)
                {
                    var activeTabModel = $parse(attrs.activeTab);

                    scope.$watch('activeTab', function(newActiveTab)
                    {
                        if (activeTabModel.assign)
                        {
                            activeTabModel.assign(scope, newActiveTab);
                        }
                    });
                }

                attrs.$observe('linksTc', function(newValue)
                {
                    scope.linksTc = newValue || 'dark';
                });

                attrs.$observe('linksBgc', function(newValue)
                {
                    scope.linksBgc = newValue || 'white';
                });

                attrs.$observe('indicator', function(newValue)
                {
                    scope.indicator = newValue || 'blue-500';
                });

                attrs.$observe('noDivider', function(newValue)
                {
                    scope.noDivider = newValue;
                });

                attrs.$observe('zDepth', function(newValue)
                {
                    scope.zDepth = newValue || '0';
                });

                attrs.$observe('layout', function(newValue)
                {
                    scope.layout = newValue || 'full';
                });

                attrs.$observe('showIconAndHeading', function(newValue)
                {
                    scope.showIconAndHeading = newValue;
                });

                attrs.$observe('iconPrefix', function(newValue)
                {
                    scope.iconPrefix = newValue || 'mdi mdi-';
                });
            }
        };
    }])
    .directive('lxTab', function()
    {
        return {
            require: '^lxTabs',
            restrict: 'E',
            scope: true,
            templateUrl: 'tab.html',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs, ctrl)
            {
                scope.data = ctrl.getScope();
                scope.index = ctrl.addTab(scope);

                attrs.$observe('heading', function(newValue)
                {
                    scope.heading = newValue;
                });

                attrs.$observe('icon', function(newValue)
                {
                    scope.icon = newValue;
                });

                scope.$on('$destroy', function(scope)
                {
                    ctrl.removeTab(scope.currentScope);
                });
            }
        };
    })
    .directive('lxTabLink', ['$timeout', function($timeout)
    {
        return {
            require: '^lxTabs',
            restrict: 'A',
            link: function(scope, element)
            {
                if (scope.activeTab === element.parent().index())
                {
                    $timeout(function()
                    {
                        element.addClass('tc-' + scope.indicator);
                    });
                }

                element
                    .on('mouseenter', function()
                    {
                        if (scope.activeTab !== element.parent().index())
                        {
                            element.addClass('tc-' + scope.indicator);
                        }
                    })
                    .on('mouseleave', function()
                    {
                        if (scope.activeTab !== element.parent().index())
                        {
                            element.removeClass('tc-' + scope.indicator);
                        }
                    });
            }
        };
    }]);
