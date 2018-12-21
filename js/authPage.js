"use strict";

const authPage = {
	init() {
		DOM.authPageLoginForgotBtn.onclick = () => {
			alert( "Sorry, this feature is not done yet." );
			return false;
		};
		DOM.authPageLogin.onsubmit = () => this._signSubmit( "login",
			DOM.authPageLoginBtn,
			DOM.authPageLoginError, [
				DOM.authPageLoginEmail,
				DOM.authPageLoginPass,
			] );
		DOM.authPageSignup.onsubmit = () => this._signSubmit( "signup",
			DOM.authPageSignupBtn,
			DOM.authPageSignupError, [
				DOM.authPageSignupUsername,
				DOM.authPageSignupEmail,
				DOM.authPageSignupPass,
			] );
	},

	// private:
	_signSubmit( signAction, btn, error, inps ) {
		btn.classList.add( "btn-loading" );
		error.textContent = "";
		gsapiClient[ signAction ].apply( gsapiClient, inps.map( inp => inp.value ) )
			.finally( () => btn.classList.remove( "btn-loading" ) )
			.then( res => {
				inps.forEach( inp => inp.value = "" );
				main.loggedIn( res.user );
				location.hash = `#/u/${ res.user.username }`;
			}, res => {
				error.textContent = res.msg;
			} );
		return false;
	},
};
