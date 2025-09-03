"use strict";

class userPage {
	#usernameLow = null;
	#page = null;
	#pageBin = null;
	#itsMe = false;
	#cmps = [];
	#cmpsMap = new Map();

	constructor() {
		Object.seal( this );
		DOM.userPagePlaylist.$setForkCallbackPromise( id => 
			gsapiClient.$forkComposition( id )
				.then( res => gsapiClient.$getComposition( res.msg ) )
				.then( res => res.composition )
				.catch( err => {
					GSUpopup.$alert( `Error ${ err.code }`, err.msg );
					throw err;
				} )
		);
		DOM.userPagePlaylist.$setDAWURL( DAWURL );
		DOM.userPagePlaylist.$setDeleteCallbackPromise( id => gsapiClient.$deleteComposition( id ).catch( err => { throw err.msg; } ) );
		DOM.userPagePlaylist.$setRestoreCallbackPromise( id => gsapiClient.$restoreComposition( id ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setSavingCallbackPromise( obj => gsapiClient.$updateMyInfo( obj ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setVerifyEmailCallbackPromise( () => gsapiClient.$resendConfirmationEmail().catch( err => { throw err.msg; } ) );
		GSUdomListen( DOM.userPagePlaylist, {
			[ GSEV_COMPLAYER_PLAY ]: d => PAGES.$main.play( d.$target, this.#cmpsMap.get( d.$targetId ).data ),
			[ GSEV_COMPLAYER_STOP ]: () => PAGES.$main.stop(),
		} );
	}

	// .........................................................................
	show( username, page ) {
		this.$update( username, page );
	}
	$update( username, page ) {
		const usernameLow = username.toLowerCase();
		const changeCmpsSubPage = this.#pageBin !== ( page === "bin" );

		this.#page = page;
		this.#pageBin = page === "bin";
		DOM.userPage.dataset.page = page || "";
		if ( usernameLow !== this.#usernameLow ) {
			this.#downloadData( username );
		} else if ( changeCmpsSubPage ) {
			DOM.userPagePlaylist.$clearCompositions();
			DOM.userPagePlaylist.$addCompositions( this.#cmps );
		}
	}
	$quit() {
		this.#usernameLow = null;
	}

	// .........................................................................
	#downloadData( username ) {
		const usernameLow = username.toLowerCase();

		return gsapiClient.$getUser( usernameLow )
			.then( user => {
				this.#updateUser( user );
				return gsapiClient.$getUserCompositions( user.id );
			} )
			.then( cmps => {
				lg(cmps)
				this.#cmps = [ ...cmps ];
				this.#cmpsMap.clear();
				cmps.forEach( cmp => this.#cmpsMap.set( cmp.id, cmp ) );
				DOM.userPagePlaylist.$clearCompositions();
				DOM.userPagePlaylist.$addCompositions( cmps );
			} );
	}
	#updateUser( u ) {
		this.#usernameLow = u.usernameLow;
		this.#itsMe = u.id === gsapiClient.$user.id;
		DOM.main.classList.toggle( "premium", gsapiClient.$user.premium );
		DOM.userPage.classList.toggle( "me", this.#itsMe );
		GSUdomSetAttr( DOM.userPagePlaylist, "whoami", this.#itsMe ? u.premium ? "itsme+" : "itsme" : "" );
		GSUdomSetAttr( DOM.userPageProfile, {
			itsme: this.#itsMe,
			username: u.username,
			lastname: u.lastname,
			firstname: u.firstname,
			avatar: u.avatar,
			email: u.email,
			emailpublic: u.emailpublic,
			emailtoverify: !u.emailchecked,
		} );
	}
}
