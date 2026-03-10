"use strict";

class gscoForgotPass {
	constructor() {
		Object.seal( this );
		DOM.forgotpassForm.$on( "submit", this.#submit.bind( this,
			DOM.forgotpassFormSubmit,
			DOM.forgotpassFormError,
			DOM.forgotpassFormEmail,
		) );
	}

	// .........................................................................
	$show() {
		DOM.forgotpassPage.$rmClass( "sended" );
		DOM.forgotpassFormEmail.$value( "" );
	}

	// .........................................................................
	#submit( btn, error, email ) {
		btn.$addClass( "btn-loading" );
		error.$text( "" );
		gsapiClient.$recoverPassword( email.$value() )
			.then( () => {
				DOM.forgotpassPage.$addClass( "sended" );
			}, err => {
				error.$text(
					err.code === 400 ? "This is not a valid email" :
					err.code === 404 ? "The email is not in the database" :
					err.code === 409 ? "A recovering email has already been sent to this address less than 1 day ago" :
					`Error ${ err.code }`
				);
			} )
			.finally( () => btn.$rmClass( "btn-loading" ) );
		return false;
	}
}
