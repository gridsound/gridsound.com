"use strict";

class gscoAuth {
	constructor() {
		Object.seal( this );
		DOM.authPageLogin.$on( "submit", () => this.#signSubmit(
			gsapiClient.$login,
			DOM.authPageLoginBtn,
			DOM.authPageLoginError,
			[ DOM.authPageLoginEmail, DOM.authPageLoginPass ],
		) );
		DOM.authPageSignup.$on( "submit", () => this.#signSubmit(
			gsapiClient.$signup,
			DOM.authPageSignupBtn,
			DOM.authPageSignupError,
			[ DOM.authPageSignupUsername, DOM.authPageSignupEmail, DOM.authPageSignupPass ],
		) );
	}

	// .........................................................................
	$show() {
		DOM.authPageSignupUsername.$value( "" );
		DOM.authPageSignupEmail.$value( "" );
		DOM.authPageSignupPass.$value( "" );
	}

	// .........................................................................
	#signSubmit( actFn, btn, error, inps ) {
		btn.$addClass( "btn-loading" );
		error.$text( "" );
		DOM.headAuth.$setAttr( "data-spin", "on" );
		actFn( ...inps.map( inp => inp.$value() ) )
			.finally( () => btn.$rmClass( "btn-loading" ) )
			.then( me => {
				inps.forEach( inp => inp.$value( "" ) );
				PAGES.$main.$loggedIn( me );
				location.hash = `#/u/${ me.usernameLow }`;
			}, res => {
				DOM.headAuth.$rmAttr( "data-spin", "on" );
				error.$text( res.msg );
			} );
		return false;
	}
}
