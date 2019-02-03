"use strict";

const userPage = {
	init() {
		this._username = "";
		DOM.cmp.remove();
		DOM.cmp.removeAttribute( "id" );
		DOM.userPageUserEdit.onclick = this.toggleUserForm.bind( this );
		DOM.userPageUserFormCancel.onclick = this.showUserForm.bind( this, false );
		DOM.userPageUserEmailNot.onclick = this._resendEmailBtnClick.bind( this );
		DOM.userPageUserForm.onsubmit = this._userInfoSubmit.bind( this );
	},
	loggedIn() {
		this.showUser( gsapiClient.user.usernameLow, "-f" );
	},
	show( username ) {
		this.showUserForm( false );
		this.showUser( username );
	},
	showUser( name, force ) {
		const username = name.toLowerCase();

		if ( username !== this._username || force === "-f" ) {
			DOM.loader.classList.add( "show" );
			( username === gsapiClient.user.usernameLow
			? Promise.resolve( gsapiClient )
			: gsapiClient.getUser( username ) )
				.finally( () => DOM.loader.classList.remove( "show" ) )
				.then( res => {
					console.log( res.user, res.compositions );
					this._username = username;
					this._updateUser( res.user );
					this._updateCompositions( res.compositions );
				}, res => {
					this._username = "";
					main.error( res.code );
				} );
		}
	},
	toggleUserForm() {
		this.showUserForm(
			DOM.userPageUserForm.classList.contains( "hidden" ) );
	},
	showUserForm( b ) {
		DOM.userPageUserForm.classList.toggle( "hidden", !b );
		if ( b ) {
			const inps = Array.from( DOM.userPageUserForm );

			inps[ 0 ].focus();
			inps[ 3 ].checked = !!gsapiClient.user.emailpublic;
			inps.forEach( inp => {
				if ( inp.name ) {
					inp.value = gsapiClient.user[ inp.name ] || "";
				}
			} );
		}
	},

	// private:
	_updateUser( u ) {
		const itsMe = u.id === gsapiClient.user.id;

		if ( itsMe ) {
			DOM.userPageUserEmailAddr.classList.toggle( "private", !u.emailpublic );
		}
		DOM.userPageUser.classList.toggle( "me", itsMe );
		DOM.userPageUserEmail.classList.toggle( "toVerify", !u.emailchecked );
		DOM.userPageUserEmailAddr.textContent = u.email;
		DOM.userPageUserUsername.textContent = u.username;
		DOM.userPageUserLastname.textContent = u.lastname;
		DOM.userPageUserFirstname.textContent = u.firstname;
		DOM.userPageUserAvatar.style.backgroundImage = u.avatar
			? `url("${ u.avatar }?s=120")`
			: "none";
	},
	_updateCompositions( cmps ) {
		const elCmps = DOM.userPageCmps;

		DOM.userPageNbCompositions.textContent = cmps.length;
		while ( elCmps.lastChild ) {
			elCmps.lastChild.remove();
		}
		elCmps.append.apply( elCmps, cmps.map( cmp => {
			const el = DOM.cmp.cloneNode( true );

			return this._fillCmp( el, cmp );
		} ) );
	},
	_fillCmp( el, obj ) {
		const cmp = JSON.parse( obj.data ),
			dur = cmp.duration * 60 / cmp.bpm,
			durMin = Math.floor( dur / 60 ),
			durSec = Math.round( dur % 60 ) + "";

		el.querySelector( ".cmpName" ).textContent = cmp.name;
		el.querySelector( ".cmpBPM" ).textContent = cmp.bpm;
		el.querySelector( ".cmpDur" ).textContent =
			`${ durMin }:${ "00".substr( durSec.length ) + durSec }`;
		return el;
	},
	_resendEmailBtnClick() {
		const btn = DOM.userPageUserEmailNot,
			done = btn.classList.contains( "loading" ) ||
				btn.classList.contains( "sended" );

		if ( !done ) {
			btn.classList.add( "loading" );
			gsapiClient.resendConfirmationEmail()
				.finally( () => btn.classList.remove( "loading" ) )
				.then( () => btn.classList.add( "sended" ) );
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
		gsapiClient.updateMyInfo( obj )
			.finally( () => DOM.userPageUserFormSubmit.classList.remove( "btn-loading" ) )
			.then( res => {
				this._updateUser( res.user );
				location.href = DOM.headUser.href;
			}, res => {
				DOM.userPageUserFormError.textContent = res.msg;
			} );
		return false;
	},
};
