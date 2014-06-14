'use strict';

angular.module('lergoApp').controller('LessonsIndexCtrl', function($scope, $log, LergoClient, $location,FilterService) {
	$scope.lessons = null;
	
	$scope.filter = {};
	$scope.ageFilter = function(lesson) {
		return FilterService.filterByAge($scope.filter, lesson.age);
	};
	$scope.languageFilter = function(lesson) {
		return FilterService.filterByLanguage($scope.filter, lesson.language);
	};
	$scope.subjectFilter = function(lesson) {
		return FilterService.filterBySubject($scope.filter, lesson.subject);
	};
	$scope.getAll = function() {
		LergoClient.lessons.getAll().then(function(result) {
			$scope.lessons = result.data;
			$scope.errorMessage = null;
			$log.info('Lesson fetched sucessfully');
		}, function(result) {
			$scope.errorMessage = 'Error in fetching Lessons : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};
	$scope.$on('$viewContentLoaded', function() {
		$scope.getAll();
	});

	$scope.create = function() {
		LergoClient.lessons.create().then(function(result) {
			var lesson = result.data;
			$scope.errorMessage = null;
			$location.path('/user/lesson/' + lesson._id + '/update');
		}, function(result) {
			$scope.errorMessage = 'Error in creating Lesson : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};

	$scope.deleteLesson = function(lesson) {
		var canDelete = window.confirm('Are you sure you want to delete the lesson: ' + lesson.name + ' ?');
		if (canDelete) {
			LergoClient.lessons.delete(lesson._id).then(function() {
				$scope.errorMessage = null;
				$log.info('Lesson deleted sucessfully');
				$scope.getAll();
			}, function(result) {
				$scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
				$log.error($scope.errorMessage);
			});
		}
	};
});
