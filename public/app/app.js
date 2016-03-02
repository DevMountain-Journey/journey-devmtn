angular.module('journey', [
    'ui.router',
    'ngTagsInput',
    'ui.gravatar',
    'angularMoment',
    'ui.slimscroll',
    'angular-loading-bar',
    'ngAnimate',
    'hc.marked'
  ])

  .run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    //Use this fake user as the currently logged in user.
   /* $rootScope.devUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@localhost',
      password: '123',
      cohort: 'DM8',
      startDate: '11-30-2015',
      assignedMentor: 'Brack'
    }; */

  });
