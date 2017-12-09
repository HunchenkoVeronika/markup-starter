$('.tabs-nav-item').on('click', function() {
	$('.tabs-nav-item').removeClass('active');
	$(this).addClass('active');
	var tabNumber = $(this).attr('data-tab-number');
	$('.tabs-content-title').removeClass('active');
	$('.tabs-content-title[data-tab-number="' + tabNumber + '"]').addClass('active');
});