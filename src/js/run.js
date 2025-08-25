"use strict";

const DAWURL = "//localhost/gridsound/daw/";

document.body.append( GSUgetTemplate( "gs-main" ) );

GSUdomQS( "#pages" ).append(
	GSUgetTemplate( "gs-homePage" ),
	GSUgetTemplate( "gs-userPage" ),
	GSUgetTemplate( "gs-authPage" ),
	GSUgetTemplate( "gs-cmpPage" ),
	GSUgetTemplate( "gs-forgotpassPage" ),
	GSUgetTemplate( "gs-resetpassPage" ),
);

const DOM = {};

GSUforEach( GSUdomQSA( "[id]" ), el => DOM[ el.id ] = el );

const PAGES = {
	$cmp: new cmpPage(),
	$home: new homePage(),
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

document.addEventListener( "scroll", e => {
	const elHTML = document.documentElement;
	const scrollSize = Math.max( 1000, elHTML.scrollHeight - elHTML.offsetHeight );
	const p = GSUmathFix( elHTML.scrollTop / scrollSize, 3 );

	GSUsetStyle( DOM.root, "--gscom-scroll", p );
} );
