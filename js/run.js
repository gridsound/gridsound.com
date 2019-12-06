"use strict";

window.DOM = {};
document.querySelectorAll( "[id]" ).forEach( el => {
	DOM[ el.id ] = el;
	if ( "toRemove" in el.dataset ) {
		el.remove();
		el.removeAttribute( "id" );
	}
} );
document.querySelectorAll( ".btn" ).forEach( btn => {
	rippleEffectInit( btn );
} );

main.init();
authPage.init();
userPage.init();
resetpassPage.init();
forgotpassPage.init();

gsapiClient.getMe()
	.then( res => {
		main.loggedIn( res.user );
		userPage.loggedIn();
	}, () => {} )
	.finally( () => {
		DOM.headAuth.dataset.spin = "";
		main.run();
	} );
