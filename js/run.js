"use strict";

window.DOM = {};
document.querySelectorAll( "[id]" ).forEach( el => {
	DOM[ el.id ] = el;
} );
document.querySelectorAll( ".btn" ).forEach( btn => {
	rippleEffectInit( btn );
} );

apiClient.init();
authPage.init();
mainPage.init();
router.init();

router.on( [], ( [ page ], [ pagePrev ] ) => {
	if ( page !== pagePrev ) {
		DOM.homePage.classList.toggle( "show", page === "" );
		DOM.userPage.classList.toggle( "show", page === "u" );
	}
} );

router.run();
