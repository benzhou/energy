(function () {
    "use strict";

    angular.module('energyCalculator.controllers', [

    ])
        .controller('energyCalculatorCtrl', function($scope, $rootScope, $log){
            $log.log("!!!!!!!!energyCalculatorCtrl called!");


            $scope.data = {
                providers:[
                    {
                        name : "Georgia Power",
                        plans : [
                            {
                                name : "Standard Plan",
                                type : "incremental",
                                rates   : [
                                    [
                                        {
                                            effectiveMonth: [1,2,3,4,5,10,11,12],
                                            baseRate : 10,
                                            addOnPerKwh : 0.031234,
                                            variableRate : [
                                                {
                                                    range : 650,
                                                    price : 0.051234
                                                },
                                                {
                                                    range : 1000,
                                                    price : 0.051
                                                },
                                                {
                                                    range : "+",
                                                    price : 0.041234
                                                }
                                            ]
                                        },
                                        {
                                            effectiveMonth: [6,7,8,9],
                                            baseRate : 10,
                                            addOnPerKwh : 0.031234,
                                            variableRate : [
                                                {
                                                    range : 650,
                                                    price : 0.051234
                                                },
                                                {
                                                    range : [651,1000],
                                                    price : 0.081234
                                                },
                                                {
                                                    range : [1000, "+"],
                                                    price : 0.091234
                                                }
                                            ]
                                        }
                                    ]
                                ]
                            },
                            {
                                name : "Nights/Weekends Plan",
                                type : "peak",
                                rates   : [
                                    [
                                        {
                                            effectiveMonth: [1,2,3,4,7,9,11,12],
                                            baseRate : 10,
                                            addOnPerKwh : 0.031234,
                                            variableRate : [
                                                {
                                                    range : [0,"+"],
                                                    weekday : [0,1,2,3,4,5,6],
                                                    hours : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                                                    price : 0.041234
                                                }
                                            ]
                                        },
                                        {
                                            effectiveMonth: [6,7,8,9],
                                            baseRate : 10,
                                            addOnPerKwh : 0.031234,
                                            variableRate : [
                                                {
                                                    range : [0,"+"],
                                                    weekday : [1,2,3,4,5],
                                                    hours : [14,15,16,17,18],
                                                    price : 0.201234
                                                },
                                                {
                                                    range : [0,"+"],
                                                    weekday : [1,2,3,4,5],
                                                    hours : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,19,20,21,22,23],
                                                    price : 0.041234
                                                },
                                                {
                                                    range : [0,"+"],
                                                    weekday : [0,6],
                                                    hours : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                                                    price : 0.041234
                                                }
                                            ]
                                        }
                                    ]
                                ]
                            },
                            {
                                name : "Plugin Plan",
                                type : "peak",
                                rates   : [
                                    [
                                        {
                                            effectiveMonth: [1,2,3,4,7,9,11,12],
                                            baseRate : 10,
                                            addOnPerKwh : 0.031234,
                                            variableRate : [
                                                {
                                                    range : [0,"+"],
                                                    weekday : [0,1,2,3,4,5,6],
                                                    hours : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                                                    price : 0.041234
                                                }
                                            ]
                                        },
                                        {
                                            effectiveMonth: [6,7,8,9],
                                            baseRate : 10,
                                            addOnPerKwh : 0.031234,
                                            variableRate : [
                                                {
                                                    range : [0,"+"],
                                                    weekday : [1,2,3,4,5],
                                                    hours : [14,15,16,17,18],
                                                    price : 0.201234
                                                },
                                                {
                                                    range : [0,"+"],
                                                    weekday : [1,2,3,4,5],
                                                    hours : [7,8,9,10,11,12,13,19,20,21,22],
                                                    price : 0.061234
                                                },
                                                {
                                                    range : [0,"+"],
                                                    weekday : [0,6],
                                                    hours : [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
                                                    price : 0.061234
                                                },
                                                {
                                                    range : [0,"+"],
                                                    weekday : [0,1,2,3,4,5,6],
                                                    hours : [0,1,2,3,4,5,6,23],
                                                    price : 0.011234
                                                }
                                            ]
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            };

            var plans = [];

            angular.forEach($scope.data.providers, function(provider){
                angular.forEach(provider.plans, function(plan){
                    plans.push({
                        name : provider.name + "-" + plan.name,
                        type : plan.type,
                        rates : plan.rates
                    });
                });
            });

            $scope.data.plans = plans;
            $scope.selectedPlan = $scope.data.plans[0];

            var
                incrementalCalculator = function(plan, useKw){
                    var
                        monthToRateMap = {},
                        monthlyResult = [],
                        calculateForMonth = function(month, rate){

                            monthlyResult.push({
                                month : month
                            });
                        };

                    angular.forEach(plan.rates, function(rate){
                        angualr.forEach(rate.effectiveMonth, function(month){
                            monthToRateMap["Month_" + month] = rate;
                        });
                    });

                    for(var i = 1; i<=12;i++){
                        calculateForMonth(i, monthToRateMap["Month_" + i]);
                    }
                },
                calculate = function(plan, usedKw){

            };

        });
}());

