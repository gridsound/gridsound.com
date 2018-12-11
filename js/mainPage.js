"use strict";

const mainPage = {
	init() {
		DOM.mainLogoutBtn.onclick = this._logoutBtnClick.bind( this );
		DOM.mainResendEmailBtn.onclick = this._resendEmailBtnClick.bind( this );
	},
	show( b = true ) {
		DOM.main.classList.toggle( "hidden", !b );
		this.updateProfile( b ? apiClient.me : {} );
		if ( b ) {
			this.getMyCompositions();
		}
	},
	getMyCompositions() {
		apiClient.getMyCompositions()
			.then( res => {
				if ( res.ok ) {
					this.updateCompositions( res.data );
				}
			} );
	},
	updateProfile( me ) {
		DOM.userPageUserEmail.textContent = me.email;
		DOM.userPageUserUsername.textContent = me.username;
		DOM.userPageUserLastname.textContent = me.lastname;
		DOM.userPageUserFirstname.textContent = me.firstname;
		DOM.userPageUserAvatar.style.backgroundImage = `url("${ me.avatar }?s=120")`;

		DOM.mainData.value = JSON.stringify( me, 4, " " );
	},
	updateCompositions( cmps ) {
		console.log( "updateCompositions", cmps );
	},

	// private:
	_logoutBtnClick() {
		apiClient.logout().then( res => {
			console.log( "logout", res );
			authPage.show();
		} );
	},
	_resendEmailBtnClick() {
		apiClient.resendConfirmationEmail().then( res => {
			console.log( "resendConfirmationEmail", res );
		} );
	},
};
