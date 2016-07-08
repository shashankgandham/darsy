window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
})();
function rafThrottle(fn) {
	var busy = false;
	return function() {
		if (busy) return;
		busy = true;
		fn.apply(this, arguments);
		requestAnimFrame(function() {
			busy = false;
		});
	};
};

$(document).ready(function() {
	var $wsPages = $(".ws-pages");
	var $headings = $(".ws-text__heading");
	var bgParts = 24;
	var staggerVal = 65;
	var staggerStep = 4;
	var textH = $(".ws-text").height();
	var winW = $(window).width();
	var winH = $(window).height();
	var curPage = 1;
	var numOfPages = $(".ws-bg").length;
	var changeAT = 0.5;
	var waveStartDelay = 0.2;
	var waveStagger = 0.013;
	var waveBlocked = false;
	var index = 1;
	var startY = 0;
	var deltaY = 0;
	var headingsY = 0;
	var $parts;

	function initBgs() {
		var arr = [];
		for (var i = 1; i <= bgParts; i++) {
			var $part = $('<div class="ws-bg__part">');
			$part.addClass("ws-bg__part-" + i);
			arr.push($part);
		}
		$(".ws-bg").append(arr);
		$wsPages.addClass("s--ready");
		$parts = $(".ws-bg__part");
		changePages();
	};

	initBgs();

	function changePages() {
		var y = (curPage - 1) * winH * -1;
		var textY = textH * (curPage - 1) * -1;
		var leftMax = index - 1;
		var rightMin = index + 1;

		TweenMax.to($(".ws-bg__part-" + index), changeAT, {y: y});

		for (var i = leftMax; i > 0; i--) {
			var d = (index - i) * waveStagger;
			TweenMax.to($(".ws-bg__part-" + i), changeAT - d, {y: y, delay: d});
		}

		for (var j = rightMin; j <= bgParts; j++) {
			var d = (j - index) * waveStagger;
			TweenMax.to($(".ws-bg__part-" + j), changeAT - d, {y: y, delay: d});
		}

		TweenMax.to($headings, changeAT, {y: textY});
	};

	function waveChange() {
		waveBlocked = true;
		var y = (curPage - 1) * winH * -1;
		var textY = textH * (curPage - 1) * -1;
		for (var i = 1; i <= bgParts; i++) {
			var $part = $(".ws-bg__part-" + i);
			var d = (i - 1) * waveStagger + waveStartDelay;
			TweenMax.to($part, changeAT, {y: y, delay: d});
		}

		TweenMax.to($headings, changeAT, {y: textY, delay: d});

		var delay = (changeAT + waveStagger * (bgParts - 1)) * 1000;
		setTimeout(function() {
			waveBlocked = false;
		}, delay);
	};

	function navigateUp() {
		if (curPage > 1) curPage--;
	};

	function navigateDown() {
		if (curPage < numOfPages) curPage++;
	};

	function navigateWaveUp() {
		if (curPage === 1) return;
		curPage--;
		waveChange();
	};

	function navigateWaveDown() {
		if (curPage === numOfPages) return;
		curPage++;
		waveChange();
	};

	function movePart($part, y) {
		var y = y - (curPage - 1) * winH;
		var headY = headingsY - (curPage - 1) * textH;
		TweenMax.to($part, changeAT, {y: y, ease: Back.easeOut.config(4)});
		TweenMax.to($headings, changeAT, {y: headY});
	};

	function moveParts(y, index) {
		var leftMax = index - 1;
		var rightMin = index + 1;
		var stagLeft = 0;
		var stagRight = 0;
		var stagStepL = -staggerStep;
		var stagStepR = -staggerStep;
		var sign = (y > 0) ? -1 : 1;

		movePart($(".ws-bg__part-" + index), y);

		for (var i = leftMax; i > 0; i--) {
			var step = index - i;
			stagStepL += (step <= 15) ? staggerStep : 1;
			var sVal = staggerVal - stagStepL;
			if (sVal < 0) sVal = 0;
			stagLeft += sVal;
			var nextY = y + stagLeft * sign;
			if (Math.abs(y) < Math.abs(stagLeft)) nextY = 0;
			movePart($(".ws-bg__part-" + i), nextY);
		}

		for (var j = rightMin; j <= bgParts; j++) {
			var step = j - index;
			stagStepR += (step <= 15) ? staggerStep : 1;
			var sVal = staggerVal - stagStepR;
			if (sVal < 0) sVal = 0;
			stagRight += sVal;
			var nextY = y + stagRight * sign;
			if (Math.abs(y) < Math.abs(stagRight)) nextY = 0;
			movePart($(".ws-bg__part-" + j), nextY);
		}
	};

	var mousemoveHandler = rafThrottle(function(e) {
		var y = e.pageY;
		var x = e.pageX;
		index = Math.ceil(x / winW * bgParts);

		deltaY = y - startY;
		headingsY = textH * deltaY / winH;
		moveParts(deltaY, index);
	});

	var touchmoveHandler = rafThrottle(function(e) {
		e.preventDefault();
		var y = e.originalEvent.touches[0].pageY;
		var x = e.originalEvent.touches[0].pageX;
		index = Math.ceil(x / winW * bgParts);

		deltaY = y - startY;
		headingsY = textH * deltaY / winH;
		moveParts(deltaY, index);
	});

	var swipeEndHandler = function() {
		$(document).off("mousemove", mousemoveHandler);
		$(document).off("touchmove", touchmoveHandler);
		$(document).off("mouseup touchend", swipeEndHandler);

		if (!deltaY) return;

		if (deltaY / winH >= 0.5) navigateUp();
		if (deltaY / winH <= -0.5) navigateDown();
		changePages();
	};

	$(document).on("mousedown touchstart", ".ws-bg__part", function(e) {
		startY = e.pageY || e.originalEvent.touches[0].pageY;
		deltaY = 0;

		$(document).on("mousemove", mousemoveHandler);
		$(document).on("touchmove", touchmoveHandler);

		$(document).on("mouseup touchend", swipeEndHandler);
	});

	$(document).on("mousewheel DOMMouseScroll", function(e) {
		if (waveBlocked) return;
		if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
			navigateWaveUp();
		} else {
			navigateWaveDown();
		}
	});

	$(document).on("keydown", function(e) {
		if (waveBlocked) return;
		if (e.which === 38) {
			navigateWaveUp();
		} else if (e.which === 40) {
			navigateWaveDown();
		}
	});

	$(window).on("resize", function() {
		winW = $(window).width();
		winH = $(window).height();
		changePages();
	});

});
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36251023-1']);
_gaq.push(['_setDomainName', 'jqueryscript.net']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

