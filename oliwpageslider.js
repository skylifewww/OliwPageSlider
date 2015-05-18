function pageslider(item) {

	var $this = item,
		$body = document.body,
		$page = $this.children,
		winH = window.innerHeight || document.documentElement.clientHeight,
		winW = window.innerWidth || document.documentElement.clientWidth,
		location = window.location,
		hash = location.hash,
		nowWheel,
		nowHandle,
		lastCallWhile = 0,
		lastCallHandle = 0,
		$pageActive,
		$noActivePage,
		pageActive = 0,
		pageCount = $page.length - 1,
		pageLength = $this.children.length,
		pageCenter = Math.round(pageLength/2),
		delta,
		deltaPrev = 0,
		touchStartPoint = {},
		touchNowPoint,
		yAbs,

		animationTime = .7,
		delayTime = animationTime*1000,
		
		loop = true,
		navKeyloop = true,

		$toTop = false,
		$navLi = document.getElementById('pageslider__nav').children,  // id of main nav > li
		$textBlock = document.getElementById('pageslider__for-text'),

		$prev = document.getElementById('b-navkey__prev'),
		$next = document.getElementById('b-navkey__next'),

		textArray = ['Ты можешь...', '... вставить текст ...', '... в зависимости ...', '... от слайда ...', 'Oliw Page Slider'],
		hrefArray = 'layout';


	if (hrefArray == 'layout') {  // add hashes from nav
		hrefArray = [];

		var thisHash;

		for (var i = 0; i < $navLi.length; i++) {
			thisHash = $navLi[i].querySelector('a').getAttribute('href');

			hrefArray.push(thisHash);
		}
	}



	if (hrefArray) { // to active page
		// read active block from nav

		var thisHash,
			regexp = /^#./;

		for (var i = 0; i < hrefArray.length; i++) {

			if( !(regexp.test(hrefArray[i])) ) {
				thisHash = '#' + hrefArray[i];
			} else {
				thisHash = hrefArray[i];
			}
			
			if (hash == thisHash) {
				pageActive = i;
				break;
			} else if (i == hrefArray.length - 1) {
				location.hash = hrefArray[0];
			}
		}
	}

	$page[pageActive].classList.add('active');

	sliderActive(pageActive);



	// Touch
	document.addEventListener('touchstart', function(event) {

		event.preventDefault();
		event.stopPropagation();

		touchStartPoint.y = event.changedTouches[0].pageY;

	}, false);



	document.addEventListener('touchend', function(event) {

		touchNowPoint = event.changedTouches[0];

		yAbs = Math.abs(touchStartPoint.y - touchNowPoint.pageY);

		if (yAbs > 20) {

			if (touchNowPoint.pageY < touchStartPoint.y) {
				delta = 1;
			}
			else {
				delta = -1;
			}

			handle(delta, delayTime, false);

		}
	}, false);



	//Keybord
	document.addEventListener('keydown', function(event) {

		var keyCode = event.keyCode;

		keyNav(keyCode);

	}, false);

	window.addEventListener('scrollDown', function(event) {
        handle(1, delayTime);
    });

	window.addEventListener('scrollUp', function(event) {
        handle(-1, delayTime);
    });



	if ( $prev ) {

		$prev.addEventListener('click', function(event) {
			fnPrevNav();
		}, false);

		$prev.addEventListener('touchend', function(event) {
			fnPrevNav();
		}, false);

	}

	if ( $next ) {

		$next.addEventListener('click', function(event) {
			fnNextNav();
		}, false);

		$next.addEventListener('touchend', function(event) {
			fnNextNav();
		}, false);

	}

	if ( $toTop ) {
		$toTop.addEventListener('click', function(event) {
			toTop();
		}, false);

		$toTop.addEventListener('touchend', function(event) {
			toTop();
		}, false);
	}



	for (var i = 0; i < $navLi.length; i++) {

		$navLi[i].num = i;

		$navLi[i].addEventListener('click', function(event) {
			event.preventDefault();
			clickNav(this);
		}, false);

		$navLi[i].addEventListener('touchend', function(event) {
			event.preventDefault();
			clickNav(this);
		}, false);

	};

	function toTop() {

		if ( pageActive != 0 ) {

			if (pageActive < pageCenter) {
				delta = -1;

				noActivePage = pageActive;
				
				handle(delta, animationTime, true, 0, noActivePage);

			} else {
				delta = 1;

				noActivePage = pageActive;

				handle(delta, animationTime, true, 0, noActivePage);
			}
		}
	}



	function fnOpacity() { $noActivePage.style.cssText = 'opacity: 0'; }  // for this project



	function sliderActive(pageActive) {

		$body.setAttribute( 'data-pageslider-progress', Math.round(100 / (pageLength - 1) * pageActive) );
		$body.setAttribute( 'data-pageslider-number', pageActive + 1 );
		$navLi[pageActive].classList.add('active');

		if (textArray) {
			$textBlock.innerHTML = textArray[pageActive];
		}

		if (hrefArray) {
			location.hash = hrefArray[pageActive];
		}
	}



	function fnPrevNav() {

		if ( pageActive == 0 ) {

			if (navKeyloop) {

				delta = 1;

				handle(delta, animationTime, true, pageCount, pageActive);
			}

		} else {

			delta = -1;
			
			handle(delta, delayTime);
		}
	}

	function fnNextNav() {

		if ( pageActive == pageCount ) {

			if (navKeyloop) {

				delta = -1;

				handle(delta, animationTime, true, 0, pageActive);
			}

		} else {

			delta = 1;
			
			handle(delta, delayTime);
		}

	}



	function clickNav(item) {

		var i = item.num;

		if (pageActive > i) {
			delta = -1;

			noActivePage = pageActive;
			
			handle(delta, animationTime, true, i, noActivePage);

		} else if (pageActive < i) {
			delta = 1;

			noActivePage = pageActive;

			handle(delta, animationTime, true, i, noActivePage);
		}
	}



	function keyNav(keyCode) {

		if ( keyCode == 87 || keyCode == 38 ) {
			// 87 - is arrow top
			// 38 - is arrow bottom
			delta = -1;

			noActivePage = pageActive;
			
			handle(delta, delayTime);

		} else if ( keyCode == 83 || keyCode == 40 ) {
			// 83 - is letter 'W'
			// 38 - is letter 'S'
			delta = 1;

			noActivePage = pageActive;

			handle(delta, delayTime);
		}
	}



	// delete all class active
	function classClean() {

		for (var i = pageCount; i >= 0; i--) {
			$page[i].classList.remove('active');
			$navLi[i].classList.remove('active');
		};

	}



	function handle(delta, delay, nav, i, noActivePage) {

		nowHandle = Date.now();

		if (nowHandle - lastCallHandle > delay) {

			$body.classList.add('onanimation');

			if ( delta > 0 ) {

				classClean();

				if (nav) {

					pageActive = i;

					$pageActive = $page[pageActive],
					$noActivePage = $page[noActivePage];
				
				} else {

					if ( !( pageActive == pageCount ) ) {

						pageActive++;

						$pageActive = $page[pageActive],
						$noActivePage = $page[pageActive].previousElementSibling;

					} else if ( pageActive == pageCount && loop ) {

						pageActive = 0;

						$pageActive = $page[pageActive],
						$noActivePage = $page[pageCount];
					}
				}

				$pageActive.classList.add('active', 'pt-page-moveFromBottom');
				$noActivePage.classList.add('active', 'pt-page-ontop', 'pt-page-moveToTop');

			} else if ( delta < 0 ) {
				
				classClean();

				if (nav) {

					pageActive = i;

					$pageActive = $page[pageActive],
					$noActivePage = $page[noActivePage];
				
				} else {

					if ( !(pageActive == 0) ) {

						pageActive--;

						$pageActive = $page[pageActive],
						$noActivePage = $page[pageActive].nextElementSibling;

					} else if ( pageActive == 0 && loop ) {

						$pageActive = $page[pageCount],
						$noActivePage = $page[pageActive];

						pageActive = pageCount; // it should be here!
					}
				}

				$pageActive.classList.add('active', 'pt-page-ontop', 'pt-page-moveFromTop');
				$noActivePage.classList.add('active', 'pt-page-moveToBottom');
			}

			sliderActive(pageActive);

			setTimeout(func, delayTime);

			lastCallHandle = nowHandle;
		}

	}



	function func() { // add class for animation and
	//add active class for new slider

		for (var i = pageCount; i >= 0; i--) {
			$body.classList.remove('onanimation');
			$page[i].classList.remove('active', 'pt-page-ontop', 'pt-page-moveFromBottom', 'pt-page-moveToTop', 'pt-page-moveToBottom', 'pt-page-moveFromTop');
		};

		$page[pageActive].classList.add('active');
	}

};