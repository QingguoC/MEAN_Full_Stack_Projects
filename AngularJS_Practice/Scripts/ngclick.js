/// <reference path = "angular.js" />
var app = angular
			.module("myModule",[])
			.controller("myController",function($scope){
				var techs = [
				{name: "MySQL", likes: 0, dislikes: 0},
				{name: "AngularJS", likes: 0, dislikes: 0},
				{name: "PHP", likes: 0, dislikes: 0},
				{name: "NodeJS", likes: 0, dislikes: 0}
				];
				$scope.techs = techs;
				$scope.addLikes = function(tech){
					tech.likes++;
				};
				$scope.addDisLikes = function(tech){
					tech.dislikes++;
				};
			})