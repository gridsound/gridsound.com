"use strict";

const authLayer = {
	init() {
		DOM.authLoginForgotBtn.onclick = () => {
			alert( "Sorry, this feature is not done yet." );
			return false;
		};
		DOM.authLogin.onsubmit = () => this._signSubmit( "login",
			DOM.authLoginBtn,
			DOM.authLoginError, [
				DOM.authLoginEmail,
				DOM.authLoginPass,
			] );
		DOM.authSignup.onsubmit = () => this._signSubmit( "signup",
			DOM.authSignupBtn,
			DOM.authSignupError, [
				DOM.authSignupUsername,
				DOM.authSignupEmail,
				DOM.authSignupPass,
			] );
		return apiClient.isLogged().then( b => this.show( !b ) );
	},
	show( b = true ) {
		const dur = parseFloat( getComputedStyle( DOM.auth ).transitionDuration );

		document.documentElement.scrollTop = 0;
		if ( !b ) {
			mainLayer.updateHead( apiClient.user );
		}
		DOM.auth.classList.toggle( "show", b );
		DOM.main.classList.toggle( "show", !b );
		setTimeout( () => {
			DOM.auth.style.display = b ? "" : "none";
			DOM.main.style.display = !b ? "" : "none";
		}, dur * 1000 );
	},

	// private:
	_signSubmit( signAction, btn, error, inps ) {
		btn.classList.add( "btn-loading" );
		error.textContent = "";
		apiClient[ signAction ].apply( apiClient, inps.map( inp => inp.value ) )
			.finally( () => btn.classList.remove( "btn-loading" ) )
			.then( () => {
				inps.forEach( inp => inp.value = "" );
				this.show( false );
			}, res => {
				error.textContent = res.msg;
			} );
		return false;
	},
};
