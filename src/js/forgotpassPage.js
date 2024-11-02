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
		DOM.forgotpassPage.classList.remove( "sended" );
		DOM.forgotpassFormEmail.value = "";
	}

	// .........................................................................
	#submit( btn, error, email ) {
		btn.classList.add( "btn-loading" );
		error.textContent = "";
		gsapiClient.$recoverPassword( email.value )
			.finally( () => btn.classList.remove( "btn-loading" ) )
			.then( () => {
				DOM.forgotpassPage.classList.add( "sended" );
			}, res => {
				error.textContent = res.msg;
			} );
		return false;
	}
}
