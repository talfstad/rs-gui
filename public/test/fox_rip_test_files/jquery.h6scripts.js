// When page ready, get top header
$(document).ready(function()
{
	heaDerElemnt  = 'header > div.row-';
	topheadHeight = $(heaDerElemnt+'top').height();

	$(heaDerElemnt+'bottom').css('padding', topheadHeight+'px 0px 10px 0px');
});
// When page ready, get top header end

// Configuration, header menus
$(document).ready(function()
{
	whnhoverthisone = 'header > div.row-top > .wrapper > div.inl > ul > li > ul > li';

	function funchoveroneshow() {
		heightvaluNum = $(thisElement).parent('ul').height();
		widthtvaluNum = $(thisElement).parent('ul').width();

		$(thisElement).find('> div').css('min-height', heightvaluNum);
		$(thisElement).find('> div').css('margin', '0px 0px 0px '+widthtvaluNum+'px');
	};

	$(whnhoverthisone).hover(function()
	{
		thisElement = $(this);

		funchoveroneshow();
	});
});
// Configuration, header menus end

// Scroll plugin
/*$(document).ready(function()
{
	heaDerElemnt  = 'header > div.row-';
	topheadHeight = $(heaDerElemnt+'top').height();

	$(window).scroll(function()
	{
		adiTiodustan = $('section > div.wrapper > aside');
		getTopfidac  = (adiTiodustan.offset().top - topheadHeight - 10);
		windoScroll  = $(window).scrollTop();

		if (windoScroll >= getTopfidac) {
			adiTiodustan.find('img.aside-image').css('position' , 'fixed');
			adiTiodustan.find('img.aside-image').css('top' , (topheadHeight + 10)+'px');
		} else {
			adiTiodustan.find('img.aside-image').css('position' , 'relative');
			adiTiodustan.find('img.aside-image').css('top' , '0px');
		};
	});

});*/
// Scroll plugin End

// Get date
$(document).ready(function()
{
	Date.prototype.mmddyyyy = function() {
		var yyyy = this.getFullYear().toString();
		// var mm = (this.getMonth()+1).toString();
		var dd  = this.getDate().toString();
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		var mm = month[d.getMonth()];

		// return yyyy + "/" + (mm[1]?mm:+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]);
		return (mm[1]?mm:+mm[0])+ ' ' + (dd[1]?dd:"0"+dd[0]) + ' ' + yyyy;
	};

	d = new Date();

	$('.todayhtml').text( d.mmddyyyy() );
})
// Get date end

// Responsive menu
$(document).ready(function()
{
	btnClci    = $('.responsivemenuone');
	menushoHid = 'header > div.row-top > .wrapper > div.inl > ul';

	btnClci.click(function()
	{
		$(menushoHid).fadeToggle(1);
		$('body').toggleClass('bodytoright');
		$('html').toggleClass('htmlhidenclss');
	});
});
// Responsive menu end