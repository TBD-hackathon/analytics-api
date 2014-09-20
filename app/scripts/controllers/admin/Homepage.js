'use strict';

angular.module('lergoApp').controller('AdminHomepageCtrl', function($scope, FilterService, LergoClient, $log) {

    $scope.adminFilter = {};
    $scope.filterPage = {};

    $scope.adminFilterOpts = {
        'showSubject' : true,
        'showLessonStatus' : true,
        'showLanguage' : true,
        'showAge' : true,
        'showViews': true,
        'showTags' : true
    };

    $scope.loadLessons = function() {
        var queryObj =  { 'filter' : _.merge({}, $scope.adminFilter), 'dollar_page' : $scope.filterPage };
        LergoClient.lessons.getAll( queryObj ).then(function (result) {
            $scope.lessons = result.data.data;
            $scope.filterPage.count = result.data.count; // the number of lessons found after filtering them.
        });
    };


    function loadStats(){
        $scope.updateStats(true);
    }

	var users = {};

	LergoClient.users.getAll().then(function(result) {
		result.data.forEach(function(user) {
			users[user._id] = user;
		});
	});

	$scope.changing = [];
	var changing = $scope.changing;

	function save(lesson) {
		// preserving selected state of lesson
		var selected = lesson.selected;
		delete lesson.selected;
		changing.push(lesson._id);
		LergoClient.lessons.update(lesson).then(function success(result) {
			var indexOf = $scope.lessons.indexOf(lesson);
			result.data.selected = selected;
			$scope.lessons[indexOf] = result.data;
			changing.splice(changing.indexOf(lesson._id), 1);
            loadStats();
            $scope.loadLessons();
		}, function error() {
			changing.splice(changing.indexOf(lesson._id), 1);
		});
	}

	$scope.makePublic = function() {
		angular.forEach($scope.lessons, function(lesson) {
			if (lesson.selected === true) {
				lesson.public = new Date().getTime();
				save(lesson);
			}
		});
	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
        angular.forEach($scope.lessons, function(item) {
            item.selected = checkbox.checked;
        });
	};

	$scope.makePrivate = function() {
		angular.forEach($scope.lessons, function(lesson) {
			if (lesson.selected === true) {
				delete lesson.public;
				save(lesson);
			}
		});
	};

	$scope.deleteLesson = function() {
		angular.forEach($scope.lessons, function(lesson) {
			if (lesson.selected === true) {
				$scope.lessons.splice($scope.lessons.indexOf(lesson), 1);
				LergoClient.lessons.delete(lesson._id).then(function() {
					$scope.errorMessage = null;
					$log.info('Lesson deleted sucessfully');
				}, function(result) {
					$scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
					$log.error($scope.errorMessage);
				});
			}
		});
	};

	$scope.isChanging = function(lesson) {
		return changing.indexOf(lesson._id) >= 0;
	};


});
