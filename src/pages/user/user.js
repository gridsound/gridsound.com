"use strict";

class gscoUser {
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
		DOM.userPageProfile.$get( 0 ).$setFollowCallbackPromise( b => ( b ? gsapiClient.$followUser : gsapiClient.$unfollowUser )( this.#id ) );
		DOM.userPageProfile.$get( 0 ).$setVerifyEmailCallbackPromise( () => gsapiClient.$resendConfirmationEmail().catch( err => { throw err.msg; } ) );
	}

	// .........................................................................
	$show( username, page ) {
		const links = DOM.userPageProfileMenu.$query( "a" );

		this.#username = username;
		links.$at( 0 ).$setAttr( "href", `#/u/${ username }` );
		links.$at( 1 ).$setAttr( "href", `#/u/${ username }/bin` );
		links.$at( 2 ).$setAttr( "href", `#/u/${ username }/likes` );
		return gsapiClient.$getUserCompositions( username )
			.then( data => {
				const u = data.$user;

				this.#cmps = data.$compositions.map( cmp => gscoPartialCmp.$domCmp( cmp ) );
				this.#updateUser( u );
				this.#updateNbCmps( u.cmps, u.cmpsDeleted, u.cmpsLiked );
				DOM.userPage.$setAttr( {
					"data-itsme": u.id === gsapiClient.$user.id,
					"data-premium": u.premium,
				} );
				this.$update( username, page );
			}, e => PAGES.$main.$error( e.code ) );
	}
	$update( username, page ) {
		if ( username !== this.#username ) {
			this.$quit();
			this.$show( username, page );
			return;
		}
		DOM.userPagePlaylist.$empty();
		if ( page === "bin" && !this.#cmpsDeleted ) {
			gsapiClient.$getUserCompositionsDeleted( username )
				.then( cmps => {
					this.#cmpsDeleted = cmps.map( cmp => gscoPartialCmp.$domCmp( cmp ) );
					this.#appendCmps( page );
				} );
			return;
		}
		if ( page === "likes" && !this.#cmpsLiked ) {
			gsapiClient.$getUserCompositionsLiked( username )
				.then( cmps => {
					this.#cmpsLiked = cmps.flatMap( ( cmp, i ) => [
						gscoPartialCmp.$domCmp( cmp ),
						cmps[ i + 1 ]?.$user.username === cmp.$user.username
							? "" : gscoPartialCmp.$domAuthor( cmp.$user ),
					] );
					this.#appendCmps( page );
				} );
			return;
		}
		this.#appendCmps( page );
	}
	$quit() {
		DOM.userPagePlaylist.$empty();
		DOM.userPage.$rmAttr( "data-premium" );
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
			element: $.$flex( { id: "userPageFollowList", y: true, g4: true },
				$.$icon( { spin: "on", style: "font-size:36px" } ),
			),
		} );
		( list === "followers"
			? gsapiClient.$getUserFollowers
			: gsapiClient.$getUserFollowing
		)( this.#id )
			.then( arr => {
				$( "#userPageFollowList" )
					.$empty()
					.$append( ...arr.map( u => $.$elem( "gsui-com-userlink", u ) ) );
			} )
			.catch( err => { throw err.msg; } );
	}
	#showEditForm() {
		GSUpopup.$custom( {
			title: "Profile edition",
			cancel: "Cancel",
			element: GSUgetTemplate( "gscoUserEditForm", gsapiClient.$user ),
			submit: obj => gsapiClient.$updateMyInfo( obj )
				.then( () => {
					obj.emailpublic = !!obj.emailpublic;
					DOM.userPageProfile.$setAttr( obj );
					return true;
				} )
				.catch( err => $( "#userPageEditFormError" ).$text( err.msg ) ),
		} );
	}

	// .........................................................................
	#onAction( e, act, res ) {
		switch ( act ) {
			case "fork":
				if ( this.#id !== gsapiClient.$user.id ) {
					window.location.hash = `/u/${ gsapiClient.$user.username }`;
				} else {
					gsapiClient.$getComposition( res.msg ).then( data => {
						const elCmp = gscoPartialCmp.$domCmp( data.composition );

						this.#cmps?.unshift( elCmp );
						DOM.userPagePlaylist.$prepend( elCmp );
						$( elCmp ).$addAttr( "forking" );
						$html.$scrollY( 0 );
					} );
				}
				break;
			case "delete":
			case "restore": {
				const a = DOM.userPageProfileNbCmps;
				const b = DOM.userPageProfileNbCmpsDeleted;
				const elCmp = e.$target.$get( 0 );

				if ( act === "restore" ) {
					this.#cmps?.unshift( elCmp );
					GSUarrayRemove( this.#cmpsDeleted, elCmp );
					a.$text( +a.$text() + 1 );
					b.$text( +b.$text() - 1 );
				} else {
					this.#cmpsDeleted?.unshift( elCmp );
					GSUarrayRemove( this.#cmps, elCmp );
					a.$text( +a.$text() - 1 );
					b.$text( +b.$text() + 1 );
				}
				gscoPartialCmp.$updateCmpActions( elCmp );
				GSUsetTimeout( () => elCmp.remove(), .35 );
			} break;
		}
	}
	#appendCmps( pg ) {
		const cmps =
			!pg ? this.#cmps :
			pg === "bin" ? this.#cmpsDeleted :
			pg === "likes" ? this.#cmpsLiked : null;

		if ( cmps ) {
			DOM.userPagePlaylist.$append( ...cmps );
		}
	}
	#updateNbCmps( a, b, c ) {
		DOM.userPageProfileNbCmps.$text( a );
		DOM.userPageProfileNbCmpsDeleted.$text( b );
		DOM.userPageProfileNbCmpsLiked.$text( c );
	}
	#updateUser( u ) {
		const itsme = u.id === gsapiClient.$user.id;

		this.#id = u.id;
		DOM.userPageProfile.$setAttr( {
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
