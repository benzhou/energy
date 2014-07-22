(function () {
    "use strict";

    angular.module('energyCalculator', [
        'ngRoute',
        'energyCalculator.controllers'
    ]).config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: '/scripts/views/index.html',
                    controller: 'energyCalculatorCtrl'
                }).
                otherwise({
                    redirectTo: '/not-found'
                });
        }]);
}());


