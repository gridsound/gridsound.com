"use strict";

class main {
	#daw = null;
	#pageName = null;
	#elCmpPlaying = null;
	#timeoutIdPageChange = null;
	$pages = {
		"":             [ DOM.homePage,       DOM.headIcon, PAGES.$home ],
		u:              [ DOM.userPage,       DOM.headUser, PAGES.$user ],
		cmp:            [ DOM.cmpPage,        null,         PAGES.$cmp ],
		auth:           [ DOM.authPage,       DOM.headAuth, PAGES.$auth ],
		resetPassword:  [ DOM.resetpassPage,  DOM.headAuth, PAGES.$resetpass ],
		forgotPassword: [ DOM.forgotpassPage, DOM.headAuth, PAGES.$forgotpass ],
	};

	constructor() {
		DOM.headAuth.onclick = this.#headAuthBtnClick.bind( this );
		window.onhashchange = () => this.#hashChange();
	}

	run() {
		this.#hashChange();
	}
	#getDAWCore() {
		if ( !this.#daw ) {
			this.#daw = new DAWCore();
			return this.#daw.$init()
				.then( () => GSUloadJSFile( "assets/gswaPeriodicWavesList-v1.js" ) )
				.then( () => {
					gswaPeriodicWaves.$loadWaves( gswaPeriodicWavesList );
					this.#daw.$destinationSetGain( .6 );
					this.#daw.cb.currentTime = t => GSUdomSetAttr( this.#elCmpPlaying, "currenttime", t * 60 / this.#daw.$cmp.$getBPM() );
					return this.#daw;
				} );
		}
		return Promise.resolve( this.#daw );
	}
	stop() {
		if ( this.#elCmpPlaying ) {
			this.#daw.$stop();
			GSUdomRmAttr( this.#elCmpPlaying, "playing" );
			this.#elCmpPlaying = null;
		}
	}
	play( elCmp, cmp ) {
		this.#getDAWCore().then( daw => {
			const currCmp = this.#elCmpPlaying;

			this.stop();
			if ( elCmp !== currCmp ) {
				daw.$openComposition( cmp ).then( () => {
					daw.$focusOn( "composition" );
					daw.$play();
					GSUdomSetAttr( elCmp, "playing" );
					this.#elCmpPlaying = elCmp;
				} );
			}
		} )
	}
	// currentTime( t ) {
	// 	this.#getDAWCore().then( daw => {
	// 		if ( this.#elCmpPlaying ) {
	// 			daw.$compositionSetCurrentTime( t );
	// 		}
	// 	} );
	// }
	loggedIn( u ) {
		gsapiClient.$setIntervalPing();
		DOM.headAuth.dataset.spin = "";
		DOM.headAuth.dataset.icon = "logout";
		DOM.headAuth.title = "Logout";
		DOM.headAuth.href = "";
		DOM.headUser.href = `#/u/${ u.username }`;
		DOM.headUsername.textContent = u.username;
		GSUdomRmClass( DOM.root, "noauth" );
		GSUdomSetAttr( DOM.headAvatar, "src", u.avatar );
	}
	error( code ) {
		DOM.errorCode.textContent = code;
		GSUdomAddClass( DOM.error, "show" );
		this.#toggleClass( null, "headLinkBefore", "selected" );
	}

	// .........................................................................
	#showPage( pageName, args ) {
		const [ page, headLink, pageObj ] = this.$pages[ pageName ];

		if ( pageName === this.#pageName ) {
			pageObj?.$update?.( ...args );
		} else {
			this.$pages[ this.#pageName ]?.[ 2 ]?.$quit?.();
			this.#pageName = pageName;
			GSUdomAddClass( DOM.loader, "show" );
			GSUdomRmClass( DOM.error, "show" );
			this.#toggleClass( headLink, "headLinkBefore", "selected" );
			this.#toggleClass( page, "pageBefore", "show" );
			GSUclearTimeout( this.#timeoutIdPageChange );
			this.#timeoutIdPageChange = GSUsetTimeout( () => {
				Promise.resolve( pageObj?.show?.( ...args ) )
					.finally( () => GSUdomRmClass( DOM.loader, "show" ) );
			}, .25 );
		}
	}
	#toggleClass( el, prevAttr, clazz ) {
		const elPrev = this[ prevAttr ];

		if ( el !== elPrev ) {
			GSUdomRmClass( elPrev, clazz );
			GSUdomAddClass( el, clazz );
			this[ prevAttr ] = el || undefined;
			return true;
		}
	}
	#hashChange() {
		const hash = location.hash;

		this.stop();
		if ( !hash ) {
			location.hash = "#/";
		} else if ( hash !== "#/" && hash.endsWith( "/" ) ) {
			location.hash = hash.substring( 0, hash.length - 1 );
		} else {
			const arr = hash.split( "/" );
			const len = arr.length - 1;
			const [ , pg, ...args ] = arr;

			if (
				( len === 2 && pg === "u" ) ||
				( len === 2 && pg === "cmp" ) ||
				( len === 3 && pg === "resetPassword" ) ||
				( len === 1 && (
					pg === "" ||
					pg === "auth" ||
					pg === "forgotPassword"
				) )
			) {
				this.#showPage( pg, args );
			} else {
				this.error( 404 );
			}
		}
	}
	#headAuthBtnClick() {
		const btn = DOM.headAuth;

		if ( !btn.getAttribute( "href" ) && btn.dataset.spin !== "on" ) {
			btn.dataset.spin = "on";
			gsapiClient.$logoutRefresh();
			return false;
		}
	}
}
