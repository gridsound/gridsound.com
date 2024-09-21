"use strict";

document.body.append( GSUgetTemplate( "gs-main" ) );

document.querySelector( "#pages" ).append(
	GSUgetTemplate( "gs-homePage" ),
	GSUgetTemplate( "gs-userPage" ),
	GSUgetTemplate( "gs-authPage" ),
	GSUgetTemplate( "gs-cmpPage" ),
	GSUgetTemplate( "gs-forgotpassPage" ),
	GSUgetTemplate( "gs-resetpassPage" ),
);

const DOM = {};

document.querySelectorAll( "[id]" ).forEach( el => DOM[ el.id ] = el );
document.querySelectorAll( ".btn" ).forEach( btn => rippleEffectInit( btn ) );

main.init();
authPage.init();
userPage.init();
cmpPage.init();
resetpassPage.init();
forgotpassPage.init();

gsapiClient.$getMe()
	.then( me => {
		main.loggedIn( me );
	} )
	.finally( () => {
		DOM.headAuth.dataset.spin = "";
		main.run();
	} );
