"use strict";

const mainPage = {
	init() {
		DOM.headLogout.onclick = this._logoutBtnClick.bind( this );
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
		DOM.mainData.value = JSON.stringify( me, 4, " " ); // tmp

		DOM.headUsername.textContent =
		DOM.userPageUserUsername.textContent = me.username;
		DOM.headAvatar.style.backgroundImage =
		DOM.userPageUserAvatar.style.backgroundImage = me.avatar
			? `url("${ me.avatar }?s=120")`
			: "none";

		DOM.userPageUserEmail.textContent = me.email;
		DOM.userPageUserLastname.textContent = me.lastname;
		DOM.userPageUserFirstname.textContent = me.firstname;
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
