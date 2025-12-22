"use strict";

class userPage {
	#id = null;
	#page = null;
	#username = null;
	#cmps = null;
	#cmpsLiked = null;
	#cmpsDeleted = null;

	constructor() {
		Object.seal( this );
		DOM.userPageProfile.$setFollowersCallbackPromise( () => gsapiClient.$getUserFollowers( this.#id ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setFollowingCallbackPromise( () => gsapiClient.$getUserFollowing( this.#id ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setFollowCallbackPromise( b => ( b ? gsapiClient.$followUser : gsapiClient.$unfollowUser )( this.#id ) );
		DOM.userPageProfile.$setSavingCallbackPromise( obj => gsapiClient.$updateMyInfo( obj ).catch( err => { throw err.msg; } ) );
		DOM.userPageProfile.$setVerifyEmailCallbackPromise( () => gsapiClient.$resendConfirmationEmail().catch( err => { throw err.msg; } ) );
	}

	// .........................................................................
	show( username, page ) {
		const links = DOM.userPageProfileMenu.childNodes;

		this.#username = username;
		GSUdomSetAttr( links[ 0 ], "href", `#/u/${ username }` );
		GSUdomSetAttr( links[ 1 ], "href", `#/u/${ username }/bin` );
		GSUdomSetAttr( links[ 2 ], "href", `#/u/${ username }/likes` );
		return gsapiClient.$getUserCompositions( username )
			.then( data => {
				const u = data.$user;

				this.#cmps = data.$compositions.map( cmp => PartialCmp.$domCmp( cmp ) );
				this.#updateUser( u );
				this.#updateNbCmps( u.cmps, u.cmpsDeleted, u.cmpsLiked );
				GSUdomSetAttr( DOM.userPage, "data-itsme", u.id === gsapiClient.$user.id );
				GSUdomSetAttr( DOM.userPage, "data-premium", u.premium );
				this.$update( username, page );
			}, e => PAGES.$main.error( e.code ) );
	}
	$update( username, page ) {
		if ( username !== this.#username ) {
			this.$quit();
			this.show( username, page );
			return;
		}
		GSUdomEmpty( DOM.userPagePlaylist );
		if ( page === "bin" && !this.#cmpsDeleted ) {
			gsapiClient.$getUserCompositionsDeleted( username )
				.then( cmps => {
					this.#cmpsDeleted = cmps.map( cmp => PartialCmp.$domCmp( cmp ) );
					this.#appendCmps( page );
				} );
			return;
		}
		if ( page === "likes" && !this.#cmpsLiked ) {
			gsapiClient.$getUserCompositionsLiked( username )
				.then( cmps => {
					this.#cmpsLiked = cmps.map( cmp => PartialCmp.$domCmp( cmp ) );
					this.#appendCmps( page );
				} );
			return;
		}
		this.#appendCmps( page );
	}
	$quit() {
		GSUdomEmpty( DOM.userPagePlaylist );
		GSUdomRmAttr( DOM.userPage, "data-premium" );
		this.#updateNbCmps( 0, 0, 0 );
		this.#id =
		this.#cmps =
		this.#username =
		this.#cmpsLiked =
		this.#cmpsDeleted = null;
	}

	// .........................................................................
	#appendCmps( pg ) {
		const cmps =
			!pg ? this.#cmps :
			pg === "bin" ? this.#cmpsDeleted :
			pg === "likes" ? this.#cmpsLiked : null;

		if ( cmps ) {
			DOM.userPagePlaylist.append( ...cmps );
		}
	}
	#updateNbCmps( a, b, c ) {
		DOM.userPageProfileNbCmps.textContent = a;
		DOM.userPageProfileNbCmpsDeleted.textContent = b;
		DOM.userPageProfileNbCmpsLiked.textContent = c;
	}
	#updateUser( u ) {
		const itsme = u.id === gsapiClient.$user.id;

		this.#id = u.id;
		GSUdomSetAttr( DOM.userPageProfile, {
			itsme,
			username: u.username,
			lastname: u.lastname,
			firstname: u.firstname,
			followers: u.followers,
			following: u.following,
			followed: u.followed,
			avatar: u.avatar,
			email: u.email,
			emailpublic: u.emailpublic,
			emailtoverify: itsme && !u.emailchecked,
		} );
	}
}
