"use strict";

class gscoForgotPass {
	constructor() {
		Object.seal( this );
		DOM.forgotpassForm.onsubmit =
			this.#submit.bind( this,
				DOM.forgotpassFormSubmit,
				DOM.forgotpassFormError,
				DOM.forgotpassFormEmail );
	}

	// .........................................................................
	$show() {
		GSUdomRmClass( DOM.forgotpassPage, "sended" );
		DOM.forgotpassFormEmail.value = "";
	}

	// .........................................................................
	#submit( btn, error, email ) {
		GSUdomAddClass( btn, "btn-loading" );
		error.textContent = "";
		gsapiClient.$recoverPassword( email.value )
			.then( () => {
				GSUdomAddClass( DOM.forgotpassPage, "sended" );
			}, err => {
				error.textContent =
					err.code === 400 ? "This is not a valid email" :
					err.code === 404 ? "The email is not in the database" :
					err.code === 409 ? "A recovering email has already been sent to this address less than 1 day ago" :
					`Error ${ err.code }`;
			} )
			.finally( () => GSUdomRmClass( btn, "btn-loading" ) );
		return false;
	}
}
