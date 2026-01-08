"use strict";

const gscoDAWURL = "//localhost/gridsound/daw/";

GSUdomBody.dataset.skin = "gray";
GSUdomBody.append( GSUgetTemplate( "gs-main" ) );

GSUdomQS( "#pages" ).append(
	GSUgetTemplate( "gscoHome" ),
	GSUgetTemplate( "gscoSearch" ),
	GSUgetTemplate( "gscoUser" ),
	GSUgetTemplate( "gscoAuth" ),
	GSUgetTemplate( "gscoLogs" ),
	GSUgetTemplate( "gscoCmp" ),
	GSUgetTemplate( "gscoExplore" ),
	GSUgetTemplate( "gscoResetPass" ),
	GSUgetTemplate( "gscoForgotPass" ),
);

const DOM = {};

GSUforEach( GSUdomQSA( "[id]" ), el => DOM[ el.id ] = el );

const PAGES = {
	$cmp: new gscoCmp(),
	$home: new gscoHome(),
	$auth: new gscoAuth(),
	$user: new gscoUser(),
	$logs: new gscoLogs(),
	$search: new gscoSearch(),
	$explore: new gscoExplore(),
	$resetpass: new gscoResetPass(),
	$forgotpass: new gscoForgotPass(),
};

PAGES.$main = new gscoMain();

gsapiClient.$getMe()
	.then( me => {
		PAGES.$main.$loggedIn( me );
	} )
	.finally( () => {
		DOM.headAuth.dataset.spin = "";
		PAGES.$main.$run();
	} );
