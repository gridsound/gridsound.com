"use strict";

const forgotpassPage = {
	init() {
		DOM.forgotpassForm.onsubmit =
			this._submit.bind( this,
				DOM.forgotpassFormSubmit,
				DOM.forgotpassFormError,
				DOM.forgotpassFormEmail );
	},
	show() {
		DOM.forgotpassPage.classList.remove( "sended" );
		setTimeout( () => {
			DOM.forgotpassFormEmail.value = "";
			DOM.forgotpassFormEmail.focus();
		}, 100 );
	},

	// private:
	_submit( btn, error, email ) {
		btn.classList.add( "btn-loading" );
		error.textContent = "";
		gsapiClient.recoverPassword( email.value )
			.finally( () => btn.classList.remove( "btn-loading" ) )
			.then( () => {
				DOM.forgotpassPage.classList.add( "sended" );
			}, res => {
				error.textContent = res.msg;
			} );
		return false;
	},
};
