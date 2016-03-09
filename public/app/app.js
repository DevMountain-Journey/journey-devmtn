angular.module('journey', [
    'ui.router',
    'ngTagsInput',
    'ui.gravatar',
    'angularMoment',
    'ui.slimscroll',
    'nvd3',
    'angular-loading-bar',
    'ngAnimate',
    'hc.marked',
    'chart.js'
  ])

  .run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  });
