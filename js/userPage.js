"use strict";

const userPage = {
	init() {
		this._username = "";
		DOM.mainResendEmailBtn.onclick = this._resendEmailBtnClick.bind( this );
		router.on( [ "u" ], path => {
			const username = path[ 1 ].toLowerCase();

			if ( username !== this._username ) {
				const itsMe = username === apiClient.user.usernameLow,
					prom = itsMe
						? Promise.resolve( apiClient )
						: apiClient.getUser( username );

				DOM.loader.classList.add( "show" );
				prom
				.finally( () => DOM.loader.classList.remove( "show" ) )
				.then( res => {
					this._username = username;
					this._updateUser( res.user );
					this._updateComposition( res.compositions );
				}, res => {
					this._username = "";
					errorPage.show( res.code );
				} );
			}
		} );
	},

	// private:
	_updateUser( u ) {
		console.log( u );
		if ( u.id === apiClient.user.id ) {
			DOM.userPageUserEmail.classList.toggle( "private", u.emailpublic !== u.email );
		}
		DOM.userPageUserEmail.textContent = u.email;
		DOM.userPageUserUsername.textContent = u.username;
		DOM.userPageUserLastname.textContent = u.lastname;
		DOM.userPageUserFirstname.textContent = u.firstname;
		DOM.userPageUserAvatar.style.backgroundImage = u.avatar
			? `url("${ u.avatar }?s=120")`
			: "none";
	},
	_updateComposition( cmps ) {
		console.log( cmps );
	},
	_resendEmailBtnClick() {
		apiClient.resendConfirmationEmail().then( res => {
			console.log( "resendConfirmationEmail", res );
		} );
	},
};
