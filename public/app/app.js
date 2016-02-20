angular.module('journey', [
    'ui.router'
  ])

  .run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.devUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@localhost',
      password: '123',
      cohort: 'DM8',
      startDate: '11-30-2015',
      assignedMentor: 'Brack'
    };

  });
