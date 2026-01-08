"use strict";

class userPage {
	#id = null;
	#username = null;
	#cmps = null;
	#cmpsLiked = null;
	#cmpsDeleted = null;

	constructor() {
		Object.seal( this );
		GSUdomListen( DOM.userPage, {
			[ GSEV_COMPLAYER_ACTION ]: this.#onAction.bind( this ),
			[ GSEV_COMPROFILE_EDIT ]: this.#showEditForm.bind( this ),
			[ GSEV_COMPROFILE_FOLLOWERS ]: this.#showFollowList.bind( this, "followers" ),
			[ GSEV_COMPROFILE_FOLLOWING ]: this.#showFollowList.bind( this, "following" ),
		} );
		DOM.userPageProfile.$setFollowCallbackPromise( b => ( b ? gsapiClient.$followUser : gsapiClient.$unfollowUser )( this.#id ) );
		DOM.userPageProfile.$setVerifyEmailCallbackPromise( () => gsapiClient.$resendConfirmationEmail().catch( err => { throw err.msg; } ) );
	}

	// .........................................................................
	$show( username, page ) {
		const links = GSUdomQSA( DOM.userPageProfileMenu, "a" );

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
			}, e => PAGES.$main.$error( e.code ) );
	}
	$update( username, page ) {
		if ( username !== this.#username ) {
			this.$quit();
			this.$show( username, page );
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
					this.#cmpsLiked = cmps.flatMap( ( cmp, i ) => [
						PartialCmp.$domCmp( cmp ),
						cmps[ i + 1 ]?.$user.username === cmp.$user.username
							? "" : PartialCmp.$domAuthor( cmp.$user ),
					] );
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
	#showFollowList( list ) {
		GSUpopup.$custom( {
			title: `${ this.#username }'s ${ list }`,
			element: GSUcreateFlex( { id: "userPageFollowList", y: true, g4: true },
				GSUcreateIcon( { spin: "on", style: { fontSize: "36px" } } ),
			),
		} );
		( list === "followers"
			? gsapiClient.$getUserFollowers
			: gsapiClient.$getUserFollowing
		)( this.#id )
			.then( arr => {
				const list = GSUdomQS( "#userPageFollowList" );

				GSUdomEmpty( list );
				list.append( ...arr.map( u => GSUcreateElement( "gsui-com-userlink", u ) ) );
			} )
			.catch( err => { throw err.msg; } );
	}
	#showEditForm() {
		GSUpopup.$custom( {
			title: "Profile edition",
			cancel: "Cancel",
			element: GSUgetTemplate( "gs-userPage-edit-form", gsapiClient.$user ),
			submit: obj => gsapiClient.$updateMyInfo( obj )
				.then( () => {
					obj.emailpublic = !!obj.emailpublic;
					GSUdomSetAttr( DOM.userPageProfile, obj );
					return true;
				} )
				.catch( err => GSUdomQS( "#userPageEditFormError" ).textContent = err.msg ),
		} );
	}

	// .........................................................................
	#onAction( e, act ) {
		const restoring = act === "restore";

		if ( act === "delete" || restoring ) {
			const a = DOM.userPageProfileNbCmps;
			const b = DOM.userPageProfileNbCmpsDeleted;
			const elCmp = e.$target;

			if ( restoring ) {
				this.#cmps?.unshift( elCmp );
				GSUarrayRemove( this.#cmpsDeleted, elCmp );
				a.textContent = +a.textContent + 1;
				b.textContent -= 1;
			} else {
				this.#cmpsDeleted?.unshift( elCmp );
				GSUarrayRemove( this.#cmps, elCmp );
				a.textContent -= 1;
				b.textContent = +b.textContent + 1;
			}
			PartialCmp.$updateCmpActions( elCmp );
			GSUsetTimeout( () => elCmp.remove(), .35 );
		}
	}
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
