"use strict";

const main = {
	_cmpPlaying: null,

	init() {
		DOM.headAuth.onclick = this._headAuthBtnClick.bind( this );
		window.onhashchange = () => this._hashChange();
		this._timeoutIdPageChange = null;
		this.pages = {
			"": [ DOM.homePage, DOM.headIcon ],
			"u": [ DOM.userPage, DOM.headUser, userPage ],
			"cmp": [ DOM.cmpPage, null, cmpPage ],
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
			GSUloadJSFile( "assets/gswaPeriodicWavesList-v1.js" )
				.then( () => gswaPeriodicWaves.$loadWaves( gswaPeriodicWavesList ) );
			this.daw = new DAWCore();
			this.daw.$destinationSetGain( .6 );
			this.daw.cb.currentTime = t => {
				if ( this._cmpPlaying ) {
					GSUsetAttribute( this._cmpPlaying, "currenttime", t * 60 / this.daw.$getBPM() );
				}
			};
		}
		return this.daw;
	},
	stop() {
		if ( this._cmpPlaying ) {
			this.daw.$stop();
			GSUsetAttribute( this._cmpPlaying, "playing", false );
			this._cmpPlaying = null;
		}
	},
	play( elCmp, cmp ) {
		const daw = this.getDAWCore();
		const currCmp = this._cmpPlaying;

		this.stop();
		if ( elCmp !== currCmp ) {
			daw.$addCompositionByJSObject( cmp, { saveMode: "cloud" } )
				.then( cmpData => daw.$openComposition( "cloud", cmpData.id ) )
				.then( () => {
					daw.$focusOn( "composition" );
					daw.$play();
					GSUsetAttribute( elCmp, "playing", true );
					this._cmpPlaying = elCmp;
				} );
		}
	},
	currentTime( t ) {
		const daw = this.getDAWCore();

		if ( this._cmpPlaying ) {
			daw.$compositionSetCurrentTime( t );
		}
	},
	loggedIn( u ) {
		DOM.headAuth.dataset.spin = "";
		DOM.headAuth.dataset.icon = "logout";
		DOM.headAuth.href = "";
		DOM.headUser.href = `#/u/${ u.username }`;
		DOM.headUsername.textContent = u.username;
		DOM.main.classList.remove( "noauth" );
		userAvatar.setAvatar( DOM.headAvatar, u.avatar );
	},
	error( code ) {
		DOM.errorCode.textContent = code;
		DOM.error.classList.add( "show" );
		this._toggleClass( null, "headLinkBefore", "selected" );
	},

	// .........................................................................
	_showPage( pageName, args ) {
		const [ page, headLink, pageObj ] = this.pages[ pageName ];

		DOM.loader.classList.add( "show" );
		DOM.error.classList.remove( "show" );
		this._toggleClass( headLink, "headLinkBefore", "selected" );
		this._toggleClass( page, "pageBefore", "show" );
		clearTimeout( this._timeoutIdPageChange );
		this._timeoutIdPageChange = setTimeout( () => {
			Promise.resolve( pageObj && pageObj.show && pageObj.show( ...args ) )
				.finally( () => DOM.loader.classList.remove( "show" ) );
		}, 250 );
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
				[, pg, ...args ] = arr;

			if (
				( len <= 3 && ( pg === "u" || pg === "cmp" ) ) ||
				( len === 4 && ( pg === "resetPassword" ) ) ||
				( len === 2 && ( pg === "" || pg === "auth" || pg === "forgotPassword" ) )
			) {
				this._showPage( pg, args );
			} else {
				this.error( 404 );
			}
		}
	},
	_headAuthBtnClick() {
		const btn = DOM.headAuth;

		if ( !btn.getAttribute( "href" ) && btn.dataset.spin !== "on" ) {
			btn.dataset.spin = "on";
			gsapiClient.$logoutRefresh();
			return false;
		}
	},
};
