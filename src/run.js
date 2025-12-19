"use strict";

const DAWURL = "//localhost/gridsound/daw/";

document.body.dataset.skin = "gray";
document.body.append( GSUgetTemplate( "gs-main" ) );

GSUdomQS( "#pages" ).append(
	GSUgetTemplate( "gs-homePage" ),
	GSUgetTemplate( "gs-searchPage" ),
	GSUgetTemplate( "gs-userPage" ),
	GSUgetTemplate( "gs-authPage" ),
	GSUgetTemplate( "gs-logsPage" ),
	GSUgetTemplate( "gs-cmpPage" ),
	GSUgetTemplate( "gs-explorePage" ),
	GSUgetTemplate( "gs-resetpassPage" ),
	GSUgetTemplate( "gs-forgotpassPage" ),
);

const DOM = {};

GSUforEach( GSUdomQSA( "[id]" ), el => DOM[ el.id ] = el );

const PAGES = {
	$cmp: new cmpPage(),
	$home: new homePage(),
	$auth: new authPage(),
	$user: new userPage(),
	$logs: new logsPage(),
	$search: new searchPage(),
	$explore: new explorePage(),
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
	const scrollSize = Math.max( 2000, elHTML.scrollHeight - elHTML.offsetHeight );
	const p = GSUmathFix( elHTML.scrollTop / scrollSize, 3 );

	GSUdomStyle( DOM.root, "--gscom-scroll", p );
} );
