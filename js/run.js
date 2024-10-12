"use strict";

const DAWURL = "//localhost/gridsound/daw/";

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

const PAGES = {
	$cmp: new cmpPage(),
	$auth: new authPage(),
	$user: new userPage(),
	$resetpass: new resetpassPage(),
	$forgotpass: new forgotpassPage(),
};
PAGES.$main = new main();

gsapiClient.$getMe()
	.then( me => {
		PAGES.$main.loggedIn( me );
	} )
	.finally( () => {
		DOM.headAuth.dataset.spin = "";
		PAGES.$main.run();
	} );
