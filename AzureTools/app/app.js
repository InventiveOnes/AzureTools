﻿(function () {
    'use strict';

    var angular = require('./node_modules/angular/index.js');
    var angularRoute = require('./node_modules/angular-ui-router/release/angular-ui-router.js');

    window.$ = require('./node_modules/jquery/dist/jquery.js');
    var dataTable = require('./node_modules/datatables/media/js/jquery.dataTables.js');
    $.DataTable = dataTable;

    angular.module('exceptionOverride', []).factory('$exceptionHandler',[function () {
        return function (exception, cause) {
            var data = {
                type: 'angular',
                url: window.location.hash,
                localtime: Date.now()
            };
            if (cause) { data.cause = cause; }
            if (exception) {
                if (exception.message) { data.message = exception.message; }
                if (exception.name) { data.name = exception.name; }
                if (exception.stack) { data.stack = exception.stack; }
            }

            var el = document.getElementById('sendEmail');
            var alertArea = document.getElementById('alertArea');
            if (el && alertArea) {
                alertArea.style.display = "block";
                el.href = 'mailto:' + 'azuretools@gmail.com' + '?subject=' + 'Bug Report' + '&body='
                    + data.message + '|' + data.name + '|' + data.stack
                + '|' + data.type + '|' + data.url + '|' + data.localtime;
            }

            throw exception;
        };
    }]);

    angular
        .module('alerts', [])
        .factory('$bugReport', [
            function () {
                return require('./common/errorAlert.js').create('azuretools@gmail.com');
            }
        ]);

    angular
        .module('common', [angularRoute])
        .factory('$busyIndicator', [
            '$rootScope', function ($rootScope) {
                return require('./common/busyIndicator.js').create($rootScope);
            }
        ])
        .controller('BusyIndicatorController', [
            '$scope', '$busyIndicator', function ($scope, $busyIndicator) {
                $scope.BusyIndicator = $busyIndicator;
            }
        ]);

    angular
        .module('dialogs', [angularRoute])
        .factory('$dialogViewModel', function () {
            return require('./common/dialogs/dialog.js').create();
        })
        .controller('DialogsController', [
            '$scope', '$dialogViewModel', function ($scope, $dialogViewModel) {
                $scope.DialogViewModel = $dialogViewModel;
                $dialogViewModel.Body = '';
                $dialogViewModel.IsVisible = false;

                $scope.$on('$stateChangeStart',
                    function (evt, toState, toParams, fromState, fromParams) {
                        $dialogViewModel.IsVisible = false;
                    });
            }
        ]);

    angular
        .module('actionBar', [])
        .factory('$actionBarItems', function () {
            return { IsActionBarVisible: false };
        })
        .controller('ActionBarController', [
            '$scope', '$actionBarItems', function ($scope, $actionBarItems) {
                $scope.ActionBarItems = $actionBarItems;
            }
        ]);

    angular
        .module('tiles.redis', [angularRoute])
        .factory('$redisClientFactory', function () {
            var clientFactory =
                require('./redis/model/redisClientFactory.js').createClient;
               // require('./redis/model/redisClientFactoryMock.js').createClient;
            return clientFactory;
        })
        .factory('$redisScanner', function () {
             return require('./node_modules/redisscan/index.js');
          //  return require('./redis/model/redisScannerMock.js');
        })
        .factory('$redisSettings', function () {
            return require('./redis/model/redisSettings.js').create();
        })
        .factory('$dataTablePresenter', [
            '$redisClientFactory', '$redisSettings', function ($redisClientFactory, $redisSettings) {
                return require('./redis/presenter/redisPresenter.js').create($redisClientFactory, $redisSettings);
            }
        ])
        .controller('RedisController', [
            '$scope', '$redisClientFactory', '$dataTablePresenter', '$actionBarItems', '$dialogViewModel', '$redisSettings', '$redisScanner', '$busyIndicator',
            function ($scope, $redisClientFactory, $dataTablePresenter, $actionBarItems, $dialogViewModel, $redisSettings, $redisScanner, $busyIndicator) {
                $scope.RedisViewModel = require('./redis/viewModel/redisviewModel.js')
                    .create($redisClientFactory, $dataTablePresenter, $actionBarItems, $dialogViewModel, $redisSettings, $redisScanner, $busyIndicator);
            }
        ])
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('redis', {
                    url: "/redis",
                    templateUrl: "redis/view/index.html",
                    controller: 'RedisController',
                    params: {
                        seq: {}
                    }
                });
        });

    angular
        .module('tiles', [angularRoute, 'actionBar'])
        .controller('TilesController', [
            '$scope', '$state', '$actionBarItems', function ($scope, $state, $actionBarItems) {
                $scope.TilesViewModel = require('./tiles/viewModel/tilesViewModel.js')
                    .create($state, $actionBarItems);
            }
        ])
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $stateProvider
                .state('tiles', {
                    url: "",
                    templateUrl: "tiles/view/index.html",
                    controller: 'TilesController',
                    params: {
                        seq: {}
                    }
                });
        });

    angular
        .module('app', ['exceptionOverride','alerts', 'common', 'actionBar', 'dialogs', 'tiles', 'tiles.redis'], function () {

        })
        .controller('AppController', ['$bugReport', function ($bugReport) { }])
        .config(function () {

        });
})();