"use strict";

window.DOM = {};
document.querySelectorAll( "[id]" ).forEach( el => {
	DOM[ el.id ] = el;
} );
document.querySelectorAll( ".btn" ).forEach( btn => {
	rippleEffectInit( btn );
} );

router.init();
apiClient.init();

userPageUser.init();

authLayer.init()
	.then( () => {
		mainLayer.init();
		userPage.init();
		router.run();
	} );
