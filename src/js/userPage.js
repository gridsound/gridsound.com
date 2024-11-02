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
		DOM.gsuiComProfile.$setSavingCallbackPromise( this.#userInfoSubmit.bind( this ) );
		DOM.gsuiComProfile.$setVerifyEmailCallbackPromise( this.#resendEmailBtnClick.bind( this ) );
		GSUlistenEvents( DOM.userPageCmps, {
			gsuiComPlayer: {
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
	#updateUser( u ) {
		this.#usernameLow = u.usernameLow;
		this.#itsMe = u.id === gsapiClient.$user.id;
		DOM.main.classList.toggle( "premium", gsapiClient.$user.premium );
		DOM.userPage.classList.toggle( "me", this.#itsMe );
		GSUsetAttribute( DOM.gsuiComProfile, {
			itsme: this.#itsMe,
			username: u.username,
			lastname: u.lastname,
			firstname: u.firstname,
			avatar: u.avatar,
			email: u.email,
			emailpublic: u.emailpublic,
			emailtoverify: !u.emailchecked,
		} );
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

			lg(cmps)
			GSUemptyElement( DOM.userPageCmps );
			DOM.userPageCmps.append( ...cmps.map( cmp => {
				return GSUcreateElement( "gsui-com-player", {
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
		return gsapiClient.$resendConfirmationEmail().catch( err => { throw err.msg; } );
	}
	#userInfoSubmit( obj ) {
		return gsapiClient.$updateMyInfo( obj ).catch( err => { throw err.msg; } );
	}
	#forkComposition( elCmp ) {
		gsapiClient.$forkComposition( elCmp.dataset.id )
			.then( res => {
				lg( "forked with success", elCmp.dataset.id, res );
				return gsapiClient.$getComposition( res.msg );
			} )
			.then( obj => {
				lg(obj.composition.data)
			} )
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
