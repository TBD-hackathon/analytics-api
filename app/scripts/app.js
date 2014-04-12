'use strict';

angular.module('lergoApp', [])
    .config(function ($routeProvider, $httpProvider) {

        $routeProvider
            .when('/user/lesson/create',{
                'templateUrl':'views/lesson/create.html',
                'controller':'CreateLessonCtrl'
            })
            .when('/user/homepage', {
                templateUrl: 'views/homepage.html',
                controller: 'HomepageCtrl'
            })
            .when('/public/kitchenSink', {
                templateUrl: 'views/kitchenSink.html'

            })
            .when('/public/session/signup', {
                templateUrl: 'views/session/signup.html',
                controller:'SignupCtrl'
            })
            .when('/public/session/login', {
                templateUrl: 'views/session/login.html',
                controller:'LoginCtrl'
            })
            .when('/user/lesson/create', {
                templateUrl: 'views/lesson/createlesson.html',
                controller:'LessonCtrl'
            })
            .when('/user/lessons', {
                templateUrl: 'views/lesson/mylessons.html',
                controller:'LessonCtrl'
            })
            .when('/public/about', {
                templateUrl: 'views/about.html',
                controller: 'SignupCtrl'
            })
            .when('/', {
                redirectTo: '/public/session/login'
            })
            .otherwise({
                templateUrl: 'views/errors/notFound.html'
//                redirectTo: '/'
            });





        var interceptor = ['$rootScope', '$q', '$location', function (scope, $q, $location) {

            function success(response) {
                return response;
            }

            function error(response) {
                var status = response.status;

                if (status === 401 && $location.path().indexOf('/public') !== 0 ) {
                    $location.path( '/public/session/login');
                    return;
                }

                if ( !!response.message ){
                    scope.pageError = response.message;
                }
                // otherwise
                return $q.reject(response);

            }

            return function (promise) {
                return promise.then(success, error);
            };

        }];
        $httpProvider.responseInterceptors.push(interceptor);



    });
