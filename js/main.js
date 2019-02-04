"use strict";

const main = {
	init() {
		DOM.headAuth.onclick = this._headAuthBtnClick.bind( this );
		DOM.pages.append.apply( DOM.pages, document.querySelectorAll( ".page" ) );
		window.onhashchange = () => this._hashChange();
		this.pages = {
			"": [ DOM.homePage, DOM.headIcon ],
			"u": [ DOM.userPage, DOM.headUser, userPage ],
			"auth": [ DOM.authPage, DOM.headAuth, authPage ],
			"resetPassword": [ DOM.resetpassPage, DOM.headAuth, resetpassPage ],
			"forgotPassword": [ DOM.forgotpassPage, DOM.headAuth, forgotpassPage ],
		};
	},

	run() {
		this._hashChange();
	},
	getDAWCore() {
		if ( !this.daw ) {
			this.daw = new DAWCore();
			this.daw.initPianoroll(); // this should be optionnal or by default
			this.daw.destination.gain( .3 );
			this.daw.cb.currentTime = t => {
				if ( this._cmpPlaying ) {
					this._cmpPlaying.currentTime( t );
				}
			};
		}
		return this.daw;
	},
	stop() {
		if ( this._cmpPlaying ) {
			this.daw.stop();
			this._cmpPlaying.stop();
			delete this._cmpPlaying;
		}
	},
	play( cmp ) {
		const daw = this.getDAWCore(),
			currCmp = this._cmpPlaying;

		this.stop();
		if ( cmp !== currCmp ) {
			daw.addComposition( cmp.data, { saveMode: "cloud" } )
				.then( cmpData => daw.openComposition( "cloud", cmpData.id ) )
				.then( () => {
					daw.compositionFocus();
					daw.play();
					cmp.play();
					this._cmpPlaying = cmp;
				} );
		}
	},
	currentTime( t ) {
		const daw = this.getDAWCore(),
			currCmp = this._cmpPlaying;

		if ( currCmp ) {
			daw.composition.setCurrentTime( t );
		}
	},
	loggedIn( u ) {
		DOM.headAuth.href = "";
		DOM.headUser.href = `#/u/${ u.username }`;
		DOM.headUsername.textContent = u.username;
		DOM.headAvatar.style.backgroundImage = u.avatar
			? `url("${ u.avatar }?s=120")`
			: "none";
		DOM.main.classList.remove( "noauth" );
	},
	error( code ) {
		DOM.errorCode.textContent = code;
		DOM.error.classList.add( "show" );
		this._toggleClass( null, "headLinkBefore", "selected" );
	},

	_showPage( pageName, a, b ) {
		const [ page, headLink, pageObj ] = this.pages[ pageName ];

		DOM.error.classList.remove( "show" );
		this._toggleClass( headLink, "headLinkBefore", "selected" );
		this._toggleClass( page, "pageBefore", "show" );
		if ( pageObj && pageObj.show ) {
			pageObj.show( a, b );
		}
	},
	_toggleClass( el, prevAttr, clazz ) {
		const elPrev = this[ prevAttr ];

		if ( el !== elPrev ) {
			elPrev && elPrev.classList.remove( clazz );
			el && el.classList.add( clazz );
			this[ prevAttr ] = el || undefined;
			return true;
		}
	},
	_hashChange() {
		const hash = location.hash;

		this.stop();
		if ( !hash ) {
			location.hash = "#/";
		} else if ( hash !== "#/" && hash.endsWith( "/" ) ) {
			location.hash = hash.substr( 0, hash.length - 1 );
		} else {
			const arr = hash.split( "/" ),
				len = arr.length,
				[, pg, attrA, attrB ] = arr;

			if (
				( len <= 3 && ( pg === "u" ) ) ||
				( len === 4 && ( pg === "resetPassword" ) ) ||
				( len === 2 && ( pg === "" || pg === "auth" || pg === "forgotPassword" ) )
			) {
				if ( this._showPage( pg, attrA, attrB ) === false ) {
					this.error( 404 );
				}
			} else {
				this.error( 404 );
			}
		}
	},
	_headAuthBtnClick() {
		const btn = DOM.headAuth;

		if ( !btn.getAttribute( "href" ) && !btn.classList.contains( "loading" ) ) {
			btn.classList.add( "loading" );
			gsapiClient.logoutRefresh();
			return false;
		}
	},
};
