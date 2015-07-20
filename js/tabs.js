$(document).ready(function() {
	// for the sidebar
	$('li.note-thumb').click(function(e) {
		$('.active').removeClass("active");
		$(this).addClass("active");
	});
});
