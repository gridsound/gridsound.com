"use strict";

const gscoDAWURL = "//localhost/gridsound/daw/";

$body.$setAttr( "data-skin", "gray" )
	.$append( $.$getTemplate( "gs-main" ) );

$( "#pages" ).$append(
	$.$getTemplate( "gscoHome" ),
	$.$getTemplate( "gscoSearch" ),
	$.$getTemplate( "gscoUser" ),
	$.$getTemplate( "gscoAuth" ),
	$.$getTemplate( "gscoLogs" ),
	$.$getTemplate( "gscoCmp" ),
	$.$getTemplate( "gscoExplore" ),
	$.$getTemplate( "gscoResetPass" ),
	$.$getTemplate( "gscoForgotPass" ),
);

const DOM = {};

$( "[id]" ).$each( el => DOM[ el.id ] = $( el ) );

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
		DOM.headAuth.$addAttr( "data-spin" );
		PAGES.$main.$run();
	} );
