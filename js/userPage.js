"use strict";

const userPage = {
	cmpsMap: new Map(),

	init() {
		DOM.userPageUserEdit.onclick = this.toggleUserForm.bind( this );
		DOM.userPageUserForm.onsubmit = this._userInfoSubmit.bind( this );
		DOM.userPageUserEmailNot.onclick = this._resendEmailBtnClick.bind( this );
		DOM.userPageUserFormCancel.onclick = this.showUserForm.bind( this, false );
		GSUlistenEvents( DOM.userPageCmps, {
			gsuiCmpPlayer: {
				play: ( d, t ) => { main.play( t, this.cmpsMap.get( t.dataset.id ) ); },
				stop: ( d, t ) => { main.stop(); },
			},
		} );
	},
	show( username ) {
		const usernameLow = username.toLowerCase();

		this.showUserForm( false );
		return ( usernameLow === gsapiClient.$user.usernameLow
			? Promise.resolve( gsapiClient.$user )
			: gsapiClient.$getUser( usernameLow ) )
				.then( user => {
					this._updateUser( user );
					return gsapiClient.$getUserCompositions( user.id );
				} )
				.then( cmps => {
					this._updateCompositions( cmps );
				} )
				.catch( err => main.error( err.code ) );
	},
	toggleUserForm() {
		this.showUserForm( DOM.userPageUserForm.classList.contains( "hidden" ) );
	},
	showUserForm( b ) {
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
	},

	// .........................................................................
	_updateUser( u ) {
		const itsMe = u.id === gsapiClient.$user.id;

		DOM.userPageUser.classList.toggle( "me", itsMe );
		DOM.userPageUserUsername.textContent = u.username;
		DOM.userPageUserLastname.textContent = u.lastname;
		DOM.userPageUserFirstname.textContent = u.firstname;
		DOM.userPageUserEmail.classList.toggle( "toVerify", !u.emailchecked );
		DOM.userPageUserEmailAddrText.textContent = u.email || "private email";
		DOM.userPageUserEmailAddrStatus.dataset.icon = u.emailpublic ? "public" : "private";
		userAvatar.setAvatar( DOM.userPageUserAvatar, u.avatar );
	},
	_updateCompositions( cmps ) {
		this.cmpsMap.clear();
		GSUemptyElement( DOM.userPageCmps );
		DOM.userPageNbCompositions.textContent = cmps.length;
		DOM.userPageCmps.append( ...cmps.map( cmp => {
			const uiCmp = GSUcreateElement( "gsui-cmp-player", {
				"data-id": cmp.id,
				link: `#/cmp/${ cmp.id }`,
				name: cmp.data.name,
				bpm: cmp.data.bpm,
				duration: cmp.data.duration * 60 / cmp.data.bpm,
			} );

			this.cmpsMap.set( cmp.id, cmp.data );
			return uiCmp;
		} ) );
	},
	_resendEmailBtnClick() {
		const btn = DOM.userPageUserEmailNot,
			load = DOM.userPageUserEmailSending,
			done = load.dataset.spin === "on" ||
				btn.classList.contains( "sent" );

		if ( !done ) {
			load.dataset.spin = "on";
			gsapiClient.$resendConfirmationEmail()
				.then( () => btn.classList.add( "sent" ) )
				.finally( () => load.dataset.spin = "" );
		}
	},
	_userInfoSubmit() {
		const inps = Array.from( DOM.userPageUserForm ),
			obj = inps.reduce( ( obj, inp ) => {
				if ( inp.name ) {
					obj[ inp.name ] = inp.type !== "checkbox" ? inp.value : inp.checked;
				}
				return obj;
			}, {} );

		DOM.userPageUserFormError.textContent = "";
		DOM.userPageUserFormSubmit.classList.add( "btn-loading" );
		gsapiClient.$updateMyInfo( obj )
			.then( me => {
				this._updateUser( me );
				this.showUserForm( false );
			}, res => {
				DOM.userPageUserFormError.textContent = res.msg;
			} )
			.finally( () => DOM.userPageUserFormSubmit.classList.remove( "btn-loading" ) );
		return false;
	},
};
