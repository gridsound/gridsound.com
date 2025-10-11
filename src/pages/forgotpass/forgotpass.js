"use strict";

class forgotpassPage {
	constructor() {
		Object.seal( this );
		DOM.forgotpassForm.onsubmit =
			this.#submit.bind( this,
				DOM.forgotpassFormSubmit,
				DOM.forgotpassFormError,
				DOM.forgotpassFormEmail );
	}

	show() {
		GSUdomRmClass( DOM.forgotpassPage, "sended" );
		DOM.forgotpassFormEmail.value = "";
	}

	// .........................................................................
	#submit( btn, error, email ) {
		GSUdomAddClass( btn, "btn-loading" );
		error.textContent = "";
		gsapiClient.$recoverPassword( email.value )
			.finally( () => GSUdomRmClass( btn, "btn-loading" ) )
			.then( () => {
				GSUdomAddClass( DOM.forgotpassPage, "sended" );
			}, res => {
				error.textContent = res.msg;
			} );
		return false;
	}
}
