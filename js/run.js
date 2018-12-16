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
main.init();
authPage.init();
userPage.init();

apiClient.getMe()
	.then( res => {
		main.loggedIn( res.user );
	}, () => {} )
	.finally( () => {
		DOM.headAuth.classList.remove( "loading" );
		router.run();
	} );
