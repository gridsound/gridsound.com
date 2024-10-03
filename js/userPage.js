"use strict";

class userPage {
	#page = null;
	#pageBin = null;
	#itsMe = false;
	#cmps = null;
	#cmpsMap = new Map();

	constructor() {
		Object.seal( this );
		DOM.userPageUserForm.onsubmit = this.#userInfoSubmit.bind( this );
		DOM.userPageUserEmailNot.onclick = this.#resendEmailBtnClick.bind( this );
		GSUlistenEvents( DOM.userPageCmps, {
			gsuiCmpPlayer: {
				play: ( d, t ) => { PAGES.$main.play( t, this.#cmpsMap.get( t.dataset.id ) ); },
				stop: ( d, t ) => { PAGES.$main.stop(); },
			},
		} );
	}

	show( username, page ) {
		const usernameLow = username.toLowerCase();

		this.$update( username, page );
		return ( usernameLow === gsapiClient.$user.usernameLow
			? Promise.resolve( gsapiClient.$user )
			: gsapiClient.$getUser( usernameLow )
		)
			.then( user => {
				this.#updateUser( user );
				return gsapiClient.$getUserCompositions( user.id );
			} )
			.then( cmps => {
				lg(cmps)
				this.#cmps = cmps;
				this.#cmpsMap.clear();
				cmps.forEach( cmp => this.#cmpsMap.set( cmp.id, cmp.data ) );
				cmps.deleted.forEach( cmp => this.#cmpsMap.set( cmp.id, cmp.data ) );
				DOM.userPageNbCompositions.firstChild.textContent = cmps.length;
				DOM.userPageNbCompositionsDeleted.firstChild.textContent = cmps.deleted.length;
				this.#updateCompositions();
			} )
			.catch( err => PAGES.$main.error( err.code ) );
	}
	$update( username, page ) {
		this.#page = page;
		DOM.userPage.dataset.page = page || "";
		this.#showUserForm( page === "edit" );
		this.#updateCompositions();
		GSUsetAttribute( DOM.userPageUserEdit, "href", `#/u/${ gsapiClient.$user.username }${ page === "edit" ? "" : "/edit" }` );
	}
	$quit() {
		this.#showUserForm( false );
	}

	// .........................................................................
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
	#updateCompositions() {
		const bin = this.#page === "bin";

		if ( this.#cmps && this.#pageBin !== bin ) {
			const cmps = bin
				? this.#cmps.deleted
				: this.#cmps;

			this.#pageBin = bin;
			GSUemptyElement( DOM.userPageCmps );
			DOM.userPageCmps.append( ...cmps.map( cmp => {
				return GSUcreateElement( "gsui-cmp-player", {
					"data-id": cmp.id,
					link: bin ? false : `#/cmp/${ cmp.id }`,
					edit: bin ? false : `//daw.gridsound.com/#${ cmp.id }`,
					private: !cmp.public,
					deletable: !bin && this.#itsMe,
					restorable: bin && this.#itsMe,
					name: cmp.data.name,
					bpm: cmp.data.bpm,
					duration: cmp.data.duration * 60 / cmp.data.bpm,
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
}
