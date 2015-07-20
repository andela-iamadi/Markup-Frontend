app.directive('mainToolbar', function() {
	return {
		scope: {
			days: "=",
			sessions: "=",
			datepicker: "="
		},
		templateUrl: 'app/shared/home/mainToolbar.html'
	}
})
