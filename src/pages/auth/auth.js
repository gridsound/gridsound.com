"use strict";

class gscoAuth {
	constructor() {
		Object.seal( this );
		DOM.authPageLogin.onsubmit = () => this.#signSubmit( gsapiClient.$login,
			DOM.authPageLoginBtn,
			DOM.authPageLoginError, [
				DOM.authPageLoginEmail,
				DOM.authPageLoginPass,
			] );
		DOM.authPageSignup.onsubmit = () => this.#signSubmit( gsapiClient.$signup,
			DOM.authPageSignupBtn,
			DOM.authPageSignupError, [
				DOM.authPageSignupUsername,
				DOM.authPageSignupEmail,
				DOM.authPageSignupPass,
			] );
	}

	// .........................................................................
	$show() {
		DOM.authPageSignupUsername.value =
		DOM.authPageSignupEmail.value =
		DOM.authPageSignupPass.value = "";
	}

	// .........................................................................
	#signSubmit( actFn, btn, error, inps ) {
		GSUdomAddClass( btn, "btn-loading" );
		error.textContent = "";
		DOM.headAuth.dataset.spin = "on";
		actFn( ...inps.map( inp => inp.value ) )
			.finally( () => GSUdomRmClass( btn, "btn-loading" ) )
			.then( me => {
				inps.forEach( inp => inp.value = "" );
				PAGES.$main.$loggedIn( me );
				location.hash = `#/u/${ me.usernameLow }`;
			}, res => {
				DOM.headAuth.dataset.spin = "";
				error.textContent = res.msg;
			} );
		return false;
	}
}
