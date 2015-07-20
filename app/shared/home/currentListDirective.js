app.directive('currentListDirective', function() {
	return {
		restrict: 'E',
		scope: {
			fellow: "="
		},
		templateUrl: 'app/shared/home/currentListDirective.html',
		link: function(scope, element, attrs) {
			scope.confirmButtonText = "Confirm attendance"
			scope.confirmed = false,
			scope.doConfirm  = function() {
				element.toggleClass('btn--orange');
				if (scope.confirmed) {
					scope.confirmButtonText = "Confirm attendance";
					scope.confirmed = false;
				} else {
					scope.confirmButtonText = "Attendance confirmed";
					// element.attr('.btn--orange').append('<i class="mdi mdi-checkbox-marked-circle-outline">');
					scope.confirmed = true;
				}
			}
		}
	};

})
