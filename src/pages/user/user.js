"use strict";

class userPage {
	#id = null;
	#usernameLow = null;
	#page = null;
	#pageBin = null;
	#itsMe = false;
	#cmps = [];
	#cmpsMap = new Map();

	constructor() {
		Object.seal( this );
		GSUdomListen( DOM.userPagePlaylist, {
			[ GSEV_COMPLAYLIST_UPDATE_NB ]: ( _, a, b ) => this.#updateNbCmps( a, b ),
		} );
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
		DOM.userPagePlaylist.$setLikeCallbackPromise( ( id, act ) => gsapiClient.$likeComposition( id, act ) );
		DOM.userPagePlaylist.$setDeleteCallbackPromise( id => gsapiClient.$deleteComposition( id ).catch( err => { throw err.msg; } ) );
		DOM.userPagePlaylist.$setRendersCallbackPromise( id => gsapiClient.$getCompositionRenders( id ).catch( err => { throw err.msg; } ) );
		DOM.userPagePlaylist.$setRestoreCallbackPromise( id => gsapiClient.$restoreComposition( id ).catch( err => { throw err.msg; } ) );
		DOM.userPagePlaylist.$setVisibilityCallbackPromise( ( id, vis ) => gsapiClient.$changeCompositionVisibility( id, vis ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setFollowersCallbackPromise( () => gsapiClient.$getUserFollowers( this.#id ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setFollowingCallbackPromise( () => gsapiClient.$getUserFollowing( this.#id ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setFollowCallbackPromise( b => ( b ? gsapiClient.$followUser : gsapiClient.$unfollowUser )( this.#id ) );
		DOM.userPageProfile.$setSavingCallbackPromise( obj => gsapiClient.$updateMyInfo( obj ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setVerifyEmailCallbackPromise( () => gsapiClient.$resendConfirmationEmail().catch( err => { throw err.msg; } ) );
		DOM.userPageProfileMenu.onclick = this.#onclickMenu.bind( this );
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
		const elCmp = GSUdomQS( DOM.userPagePlaylist, "gsui-com-player[playing]" );

		this.#usernameLow = null;
		GSUdomSetAttr( elCmp, "playing", false );
	}

	// .........................................................................
	#onclickMenu( e ) {
		const act = e.target.dataset.action;

		switch ( act ) {
			case "compositions":
			case "compositions-bin":
				this.#pageBin = act === "compositions-bin";
				GSUdomSetAttr( DOM.userPagePlaylist, "bin", this.#pageBin );
				break;
		}
	}
	#updateNbCmps( a, b ) {
		DOM.userPageProfileNbCmps.textContent = a;
		DOM.userPageProfileNbCmpsDeleted.textContent = b;
	}
	#downloadData( username ) {
		return gsapiClient.$getUserCompositions( username )
			.then( data => {
				this.#updateUser( data.$user );
				this.#cmps = [ ...data.$compositions, ...data.$compositionsDeleted ];
				this.#cmpsMap.clear();
				this.#cmps.forEach( cmp => this.#cmpsMap.set( cmp.id, cmp ) );
				DOM.userPagePlaylist.$clearCompositions();
				DOM.userPagePlaylist.$addCompositions( this.#cmps );
			}, e => PAGES.$main.error( e.code ) );
	}
	#updateUser( u ) {
		this.#id = u.id;
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
			followers: u.followers,
			following: u.following,
			followed: u.followed,
			avatar: u.avatar,
			email: u.email,
			emailpublic: u.emailpublic,
			emailtoverify: this.#itsMe && !u.emailchecked,
		} );
	}
}
