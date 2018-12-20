"use strict";

const userPage = {
	init() {
		this._username = "";
		DOM.userPageCmp.remove();
		DOM.userPageCmp.removeAttribute( "id" );
		DOM.userPageUserEmailNot.onclick = this._resendEmailBtnClick.bind( this );
		router.on( [ "u" ], path => {
			const username = path[ 1 ].toLowerCase(),
				itsMe = username === apiClient.user.usernameLow;

			if ( itsMe || username !== this._username ) {
				DOM.loader.classList.add( "show" );
				( itsMe
				? Promise.resolve( apiClient )
				: apiClient.getUser( username ) )
					.finally( () => DOM.loader.classList.remove( "show" ) )
					.then( res => {
						console.log( res.user, res.compositions );
						this._username = username;
						this._updateUser( res.user );
						this._updateCompositions( res.compositions );
					}, res => {
						this._username = "";
						errorPage.show( res.code );
					} );
			}
		} );
	},

	// private:
	_updateUser( u ) {
		if ( u.id === apiClient.user.id ) {
			DOM.userPageUserEmailAddr.classList.toggle( "private", u.emailpublic !== u.email );
		}
		DOM.userPageUserEmail.classList.toggle( "toVerify", u.status === "EMAIL_TO_VERIFY" );
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
			const el = DOM.userPageCmp.cloneNode( true );

			return this._fillCmp( el, cmp );
		} ) );
	},
	_fillCmp( el, obj ) {
		const cmp = JSON.parse( obj.data ),
			dur = cmp.duration * 60 / cmp.bpm,
			durMin = Math.floor( dur / 60 ),
			durSec = Math.round( dur % 60 ) + "";

		el.querySelector( ".userPageCmpName" ).textContent = cmp.name;
		el.querySelector( ".userPageCmpBPM" ).textContent = cmp.bpm;
		el.querySelector( ".userPageCmpDur" ).textContent =
			`${ durMin }:${ "00".substr( durSec.length ) + durSec }`;
		return el;
	},
	_resendEmailBtnClick() {
		const btn = DOM.userPageUserEmailNot,
			done = btn.classList.contains( "loading" ) ||
				btn.classList.contains( "sended" );

		if ( !done ) {
			btn.classList.add( "loading" );
			apiClient.resendConfirmationEmail()
				.finally( () => btn.classList.remove( "loading" ) )
				.then( () => btn.classList.add( "sended" ) );
		}
	},
};
