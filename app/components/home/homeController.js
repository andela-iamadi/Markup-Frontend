app.controller('homeController', ['$scope', 'sessionsService', 'daysService', 'attendanceService', function($scope, sessionsService, daysService, attendanceService) {
	// Initialize values for the sidebar
	$scope.sidebarMenu = [
		{text: "Dashboard", icon: "clipboard-text", status: "active" },
		{text: "Report", icon: "speedometer", status: "" },
		{text: "Settings", icon: "settings", status: "" }
	];
	// initialize session defaults in case we can't reach server
		$scope.sessions = {
				allSessions: "",
		    selectedSession: "No session yet"
		};
		// Lets initialize to get our days going by
		$scope.days = {
			allDays: "",
			selectedDay: "None selected yet"
		};
		$scope.attendance = {
			allAttendances: "",
			selectedAttendance: "None"
		}
	$scope.getDatetime = function() {
  	return (new Date).toLocaleFormat("%A, %B %e, %Y");
	};
	$scope.datepicker = {
		date: $scope.getDatetime()
	};
	$scope.people = [
    { name: 'Adam',      email: 'adam@email.com',      age: 10 },
    { name: 'Amalie',    email: 'amalie@email.com',    age: 12 },
    { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30 },
    { name: 'Samantha',  email: 'samantha@email.com',  age: 31 },
    { name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
    { name: 'Natasha',   email: 'natasha@email.com',   age: 54 },
    { name: 'Nicole',    email: 'nicole@email.com',    age: 43 },
    { name: 'Adrian',    email: 'adrian@email.com',    age: 21 }
	];

	// Now place the call to the server to get sessions and days
	sessionsService.success(function(data) {
		$scope.sessions = {
				allSessions: data,
				selectedSession: data[0]
		};
	});
	daysService.success(function(data) {
		$scope.days = {
			allDays: data,
			selectedDay: data[0]
		}
		$scope.datepicker.date = ($scope.days.selectedDay.session_day | $scope.date);
	});
	attendanceService.success(function(data) {
		$scope.attendance = {
			allAttendances: data,
			selectedAttendance: data[0]
		}
	})
}]);
