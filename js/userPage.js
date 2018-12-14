"use strict";

const userPage = {
	init() {
		DOM.mainResendEmailBtn.onclick = this._resendEmailBtnClick.bind( this );
		router.on( [ "u" ], ( [ _, name ], [ __, prevName ] ) => {
			if ( name.toLowerCase() === apiClient.me.usernameLow ) {
				this.updateUser( apiClient.me );
				this.fetchCompositions( apiClient.me.id );
			} else {
				this.updateUser( {} );
			}
		} );
	},
	fetchCompositions( userId ) {
		apiClient.getMyCompositions()
			.then( res => {
				this.updateCompositions( res.data );
			} );
	},
	updateUser( u ) {
		DOM.mainData.value = JSON.stringify( u, 4, " " ); // tmp
		DOM.userPageUserEmail.textContent = u.email;
		DOM.userPageUserUsername.textContent = u.username;
		DOM.userPageUserLastname.textContent = u.lastname;
		DOM.userPageUserFirstname.textContent = u.firstname;
		DOM.userPageUserAvatar.style.backgroundImage = u.avatar
			? `url("${ u.avatar }?s=120")`
			: "none";
	},
	updateCompositions( cmps ) {
		console.log( "updateCompositions", cmps );
	},

	// private:
	_resendEmailBtnClick() {
		apiClient.resendConfirmationEmail().then( res => {
			console.log( "resendConfirmationEmail", res );
		} );
	},
};
