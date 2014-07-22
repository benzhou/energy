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
                            },
                            {
                                name : "Nights/Weekends Plan",
                                type : "peak",
                                rates   : [
                                    {
                                        effectiveMonth: [1,2,3,4,5,10,11,12],
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
                            },
                            {
                                name : "Plugin Plan",
                                type : "peak",
                                rates   : [
                                    {
                                        effectiveMonth: [1,2,3,4,5,10,11,12],
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
            $scope.monthlyUsedKwh = 1000;

            var
                mapMonthToRate = function(rates){
                    var monthToRateMap = {};

                    angular.forEach(rates, function(rate){
                        angular.forEach(rate.effectiveMonth, function(month){
                            monthToRateMap["Month_" + month] = rate;
                        });
                    });

                    return monthToRateMap;
                },
                incrementalCalculator = function(plan, usedKw){
                    var
                        monthToRateMap = mapMonthToRate(plan.rates),
                        monthlyResult = [],
                        calculateForMonth = function(month, usedKw, rate){
                            var remainder = usedKw,
                                usagePrice = 0,
                                totalPrice = 0,
                                addOnPerKwhPrice = rate.addOnPerKwh * usedKw;

                            rate.variableRate.sort(function(a, b){
                                if(a.range === "+") return 1;
                                if(b.range === "+") return -1;

                                if(a.range < b.range) return -1;
                                if(a.range > b.range) return 1;

                                return 0;
                            });

                            for(var i=0, l= rate.variableRate.length;i<l;i++){
                                var stepUsage = remainder > rate.variableRate[i].range ? rate.variableRate[i].range : remainder;

                                usagePrice = usagePrice + stepUsage * rate.variableRate[i].price;
                                remainder = remainder - stepUsage;

                                if(remainder <= 0){
                                    break;
                                }
                            }

                            totalPrice = usagePrice + rate.baseRate + addOnPerKwhPrice;

                            return {
                                month : month,
                                usedKw : usedKw,
                                totalPrice : totalPrice,
                                usagePrice : usagePrice,
                                basePrice  : rate.baseRate,
                                addOnPerKwhPrice    : addOnPerKwhPrice
                            };
                        };

                    for(var i = 1; i<=12;i++){
                        monthlyResult.push(calculateForMonth(i, usedKw, monthToRateMap["Month_" + i]));
                    }

                    return monthlyResult;
                },
                peakCalculator = function(plan, usedKw){
                    var
                        monthToRateMap = mapMonthToRate(plan.rates),
                        monthlyResult = [],
                        calculateForMonth = function(month, usedKw, rate){
                            var usagePrice = 0,
                                totalPrice = 0,
                                addOnPerKwhPrice = rate.addOnPerKwh * usedKw,
                                maphourOfWeekRate = function(month, rate){
                                    var hourOfWeekRateMap = {};

                                    angular.forEach(rate.variableRate, function(variableRate){
                                        angular.forEach(variableRate.weekday, function(weekday){
                                            angular.forEach(variableRate.hours, function(hour){
                                                hourOfWeekRateMap["Month_" + month + "_Weekday_" + weekday + "_Hour_"+hour] = variableRate.price;
                                            });
                                        });
                                    });

                                    return hourOfWeekRateMap;
                                },
                                hourOfWeekRateMap = maphourOfWeekRate(month, rate),
                                assumeEqualDistribution = function(month, usedKw, hourOfWeekRateMap){
                                    //A week has 24 * 7 hours
                                    //Assume average days in a month is 30
                                    var perHourKwhUsed = usedKw / (30 * 24),
                                        weekPerMonth = 30/ 7,
                                        perWeekCost = 0;

                                    for(var i = 0;i<7;i++){
                                        for(var j = 0;j<24;j++){
                                            perWeekCost = perWeekCost + perHourKwhUsed * hourOfWeekRateMap["Month_" + month + "_Weekday_" + i + "_Hour_"+j];
                                        }
                                    }

                                    return perWeekCost * weekPerMonth;
                                };

                            usagePrice = assumeEqualDistribution(month, usedKw, hourOfWeekRateMap);
                            totalPrice = usagePrice + rate.baseRate + addOnPerKwhPrice;

                            return {
                                month : month,
                                usedKw : usedKw,
                                totalPrice : totalPrice,
                                usagePrice : usagePrice,
                                basePrice  : rate.baseRate,
                                addOnPerKwhPrice    : addOnPerKwhPrice
                            };
                        };

                    for(var i = 1; i<=12;i++){
                        monthlyResult.push(calculateForMonth(i, usedKw, monthToRateMap["Month_" + i]));
                    }

                    return monthlyResult;
                },
                calculate = function(plan, usedKw){
                    var monthlyResult = [],
                        annualTotalCost = 0;

                    switch(plan.type.toLowerCase()){
                        case "incremental":
                            monthlyResult = incrementalCalculator(plan, usedKw);
                            break;
                        case "peak":
                            monthlyResult = peakCalculator(plan, usedKw);
                            break;
                        default:
                            break;
                    }


                    angular.forEach(monthlyResult, function(monthResult){
                        annualTotalCost = annualTotalCost + monthResult.totalPrice;
                    });

                    return {
                        annualTotalCost : annualTotalCost,
                        monthlyCost     : monthlyResult
                    }
                },
                refreshCostCalculation = function(){
                    $scope.annualCost = calculate($scope.selectedPlan, $scope.monthlyUsedKwh);
                };

            $scope.reCalculate = function(){
                $log.log("refresh calculation.");
                refreshCostCalculation();
            };
            refreshCostCalculation();
        });
}());

