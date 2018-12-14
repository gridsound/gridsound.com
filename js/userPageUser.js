"use strict";

const userPageUser = {
	init() {
		this._username = "";
	},
	load( username ) {
		const low = username.toLowerCase();

		if ( low !== this._username ) {
			this._username = low;
			if ( low === apiClient.me.usernameLow ) {
				this._update( apiClient.me );
			} else {
				this._update( null );
				apiClient.getUser( low ).then( user => this._update( user ) );
			}
		}
	},

	// private:
	_update( u ) {
		DOM.userPageUser.classList.toggle( "loading", !u );
		DOM.mainData.value = JSON.stringify( u, 4, " " ); // tmp
		if ( u ) {
			DOM.userPageUserEmail.textContent = u.email;
			DOM.userPageUserUsername.textContent = u.username;
			DOM.userPageUserLastname.textContent = u.lastname;
			DOM.userPageUserFirstname.textContent = u.firstname;
			DOM.userPageUserAvatar.style.backgroundImage = u.avatar
				? `url("${ u.avatar }?s=120")`
				: "none";
		}
	},
};
