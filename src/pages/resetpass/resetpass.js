"use strict";

class gscoResetPass {
	#email = null;
	#code = null;

	constructor() {
		Object.seal( this );
		DOM.resetpassForm.$on( "submit", this.#submit.bind( this,
			DOM.resetpassFormSubmit,
			DOM.resetpassFormError,
			DOM.resetpassFormPass,
			DOM.resetpassFormPass2,
		) );
	}

	// .........................................................................
	$show( email, code ) {
		DOM.resetpassPage.$rmClass( "sended" );
		this.#email = email;
		this.#code = code;
		DOM.resetpassFormPass2.$value( "" );
		DOM.resetpassFormPass.$value( "" );
	}

	// .........................................................................
	#submit( btn, error, pass, pass2 ) {
		if ( pass.$value() === pass2.$value() ) {
			error.$text( "" );
			btn.$addClass( "btn-loading" );
			gsapiClient.$resetPassword( this.#email, this.#code, pass.$value() )
				.finally( () => btn.$rmClass( "btn-loading" ) )
				.then( () => {
					DOM.resetpassPage.$addClass( "sended" );
				}, err => {
					error.$text( err.msg );
				} );
		}
		return false;
	}
}
