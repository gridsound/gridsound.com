"use strict";

class userPage {
	#usernameLow = null;
	#page = null;
	#pageBin = null;
	#itsMe = false;
	#cmps = null;
	#cmpsDel = null;
	#cmpsMap = new Map();

	constructor() {
		Object.seal( this );
		DOM.userPageUserForm.onsubmit = this.#userInfoSubmit.bind( this );
		DOM.userPageUserEmailNot.onclick = this.#resendEmailBtnClick.bind( this );
		GSUlistenEvents( DOM.userPageCmps, {
			gsuiCmpPlayer: {
				play: ( d, t ) => { PAGES.$main.play( t, this.#cmpsMap.get( t.dataset.id ).data ); },
				stop: ( d, t ) => { PAGES.$main.stop(); },
				fork: ( d, t ) => this.#forkComposition( t ),
				delete: ( d, t ) => this.#deleteRestoreComposition( t, "delete" ),
				restore: ( d, t ) => this.#deleteRestoreComposition( t, "restore" ),
			},
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
			this.#updateCompositions();
		}
		this.#showUserForm( page === "edit" && usernameLow === gsapiClient.$user.usernameLow );
		GSUsetAttribute( DOM.userPageUserEdit, "href", `#/u/${ gsapiClient.$user.username }${ page === "edit" ? "" : "/edit" }` );
	}
	$quit() {
		this.#usernameLow = null;
		this.#showUserForm( false );
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
				this.#cmps = [ ...cmps ];
				this.#cmpsDel = [ ...cmps.deleted ];
				this.#cmpsMap.clear();
				this.#cmps.forEach( cmp => this.#cmpsMap.set( cmp.id, cmp ) );
				this.#cmpsDel.forEach( cmp => this.#cmpsMap.set( cmp.id, cmp ) );
				this.#updateNbCompositions();
				this.#updateCompositions();
			} )
			.catch( err => PAGES.$main.error( err.code ) );
	}
	#showUserForm( b ) {
		DOM.userPageUserForm.classList.toggle( "hidden", !b );
		if ( b ) {
			const inps = Array.from( DOM.userPageUserForm );

			inps.forEach( inp => {
				if ( inp.name ) {
					inp.value = gsapiClient.$user[ inp.name ] || "";
				}
			} );
			inps[ 3 ].checked = !!gsapiClient.$user.emailpublic;
		}
	}
	#updateUser( u ) {
		this.#usernameLow = u.usernameLow;
		this.#itsMe = u.id === gsapiClient.$user.id;
		DOM.main.classList.toggle( "premium", gsapiClient.$user.premium );
		DOM.userPage.classList.toggle( "me", this.#itsMe );
		DOM.userPageUserUsername.textContent = u.username;
		DOM.userPageUserLastname.textContent = u.lastname;
		DOM.userPageUserFirstname.textContent = u.firstname;
		DOM.userPageUserEmail.classList.toggle( "toVerify", !u.emailchecked );
		DOM.userPageUserEmailAddrText.textContent = u.email || "private email";
		DOM.userPageUserEmailAddrStatus.dataset.icon = u.emailpublic ? "public" : "private";
		userAvatar.setAvatar( DOM.userPageUserAvatar, u.avatar );
		GSUsetAttribute( DOM.userPageUserFormCancel, "href", `#/u/${ u.username }` );
		GSUsetAttribute( DOM.userPageNbCompositions, "href", this.#itsMe ? `#/u/${ u.username }` : false );
		GSUsetAttribute( DOM.userPageNbCompositionsDeleted, "href", this.#itsMe ? `#/u/${ u.username }/bin` : false );
	}
	#updateNbCompositions() {
		DOM.userPageNbCompositions.firstChild.textContent = this.#cmps.length;
		DOM.userPageNbCompositionsDeleted.firstChild.textContent = this.#cmpsDel.length;
	}
	#updateCompositions() {
		if ( this.#cmps ) {
			const cmps = this.#pageBin ? this.#cmpsDel : this.#cmps;

			GSUemptyElement( DOM.userPageCmps );
			DOM.userPageCmps.append( ...cmps.map( cmp => {
				return GSUcreateElement( "gsui-cmp-player", {
					"data-id": cmp.id,
					link: this.#pageBin ? false : `#/cmp/${ cmp.id }`,
					dawlink: this.#pageBin ? false : `${ DAWURL }#${ cmp.id }`,
					itsmine: this.#itsMe,
					private: !cmp.public,
					opensource: cmp.opensource,
					name: cmp.data.name,
					bpm: cmp.data.bpm,
					duration: cmp.data.duration * 60 / cmp.data.bpm,
					actions: !this.#itsMe ? false : this.#pageBin ? "restore" : "fork delete",
				} );
			} ) );
		}
	}
	#resendEmailBtnClick() {
		const btn = DOM.userPageUserEmailNot;
		const load = DOM.userPageUserEmailSending;
		const done = load.dataset.spin === "on" || btn.classList.contains( "sent" );

		if ( !done ) {
			load.dataset.spin = "on";
			gsapiClient.$resendConfirmationEmail()
				.then( () => btn.classList.add( "sent" ) )
				.finally( () => load.dataset.spin = "" );
		}
	}
	#userInfoSubmit() {
		const inps = Array.from( DOM.userPageUserForm );
		const obj = inps.reduce( ( obj, inp ) => {
				if ( inp.name ) {
					obj[ inp.name ] = inp.type !== "checkbox" ? inp.value : inp.checked;
				}
				return obj;
			}, {} );

		DOM.userPageUserFormError.textContent = "";
		DOM.userPageUserFormSubmit.classList.add( "btn-loading" );
		gsapiClient.$updateMyInfo( obj )
			.then( me => {
				this.#updateUser( me );
				location.hash = `/u/${ gsapiClient.$user.username }`;
			}, res => {
				DOM.userPageUserFormError.textContent = res.msg;
			} )
			.finally( () => DOM.userPageUserFormSubmit.classList.remove( "btn-loading" ) );
		return false;
	}
	#forkComposition( elCmp ) {
		gsapiClient.$forkComposition( elCmp.dataset.id );
	}
	#deleteRestoreComposition( elCmp, act ) {
		const id = elCmp.dataset.id;

		( act === "delete"
			? gsapiClient.$deleteComposition( id )
			: gsapiClient.$restoreComposition( id )
		).then( () => {
			if ( act === "delete" ) {
				this.#cmpsDel.unshift( this.#cmpsMap.get( id ) );
				this.#cmps = this.#cmps.filter( cmp => cmp.id !== id );
			} else {
				this.#cmps.unshift( this.#cmpsMap.get( id ) );
				this.#cmpsDel = this.#cmpsDel.filter( cmp => cmp.id !== id );
			}
			GSUsetAttribute( elCmp, act === "delete" ? "deleting" : "restoring", true );
			setTimeout( () => {
				elCmp.remove();
				this.#updateNbCompositions();
			}, 350 );
		} );
	}
}
