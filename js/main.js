"use strict";

class main {
	#pageName = null;
	#elCmpPlaying = null;
	#timeoutIdPageChange = null;
	$pages = {
		"":             [ DOM.homePage,       DOM.headIcon ],
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
	getDAWCore() {
		if ( !this.daw ) {
			GSUloadJSFile( "assets/gswaPeriodicWavesList-v1.js" )
				.then( () => gswaPeriodicWaves.$loadWaves( gswaPeriodicWavesList ) );
			this.daw = new DAWCore();
			this.daw.$destinationSetGain( .6 );
			this.daw.cb.currentTime = t => {
				if ( this.#elCmpPlaying ) {
					GSUsetAttribute( this.#elCmpPlaying, "currenttime", t * 60 / this.daw.$getBPM() );
				}
			};
		}
		return this.daw;
	}
	stop() {
		if ( this.#elCmpPlaying ) {
			this.daw.$stop();
			GSUsetAttribute( this.#elCmpPlaying, "playing", false );
			this.#elCmpPlaying = null;
		}
	}
	play( elCmp, cmp ) {
		const daw = this.getDAWCore();
		const currCmp = this.#elCmpPlaying;

		this.stop();
		if ( elCmp !== currCmp ) {
			daw.$addCompositionByJSObject( cmp, { saveMode: "cloud" } )
				.then( cmpData => daw.$openComposition( "cloud", cmpData.id ) )
				.then( () => {
					daw.$focusOn( "composition" );
					daw.$play();
					GSUsetAttribute( elCmp, "playing", true );
					this.#elCmpPlaying = elCmp;
				} );
		}
	}
	currentTime( t ) {
		const daw = this.getDAWCore();

		if ( this.#elCmpPlaying ) {
			daw.$compositionSetCurrentTime( t );
		}
	}
	loggedIn( u ) {
		gsapiClient.$setIntervalPing();
		DOM.headAuth.dataset.spin = "";
		DOM.headAuth.dataset.icon = "logout";
		DOM.headAuth.title = "Logout";
		DOM.headAuth.href = "";
		DOM.headUser.href = `#/u/${ u.username }`;
		DOM.headUsername.textContent = u.username;
		DOM.main.classList.remove( "noauth" );
		userAvatar.setAvatar( DOM.headAvatar, u.avatar );
	}
	error( code ) {
		DOM.errorCode.textContent = code;
		DOM.error.classList.add( "show" );
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
			DOM.loader.classList.add( "show" );
			DOM.error.classList.remove( "show" );
			this.#toggleClass( headLink, "headLinkBefore", "selected" );
			this.#toggleClass( page, "pageBefore", "show" );
			clearTimeout( this.#timeoutIdPageChange );
			this.#timeoutIdPageChange = setTimeout( () => {
				Promise.resolve( pageObj?.show?.( ...args ) )
					.finally( () => DOM.loader.classList.remove( "show" ) );
			}, 250 );
		}
	}
	#toggleClass( el, prevAttr, clazz ) {
		const elPrev = this[ prevAttr ];

		if ( el !== elPrev ) {
			elPrev && elPrev.classList.remove( clazz );
			el && el.classList.add( clazz );
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
				(
					( len === 2 && pg === "u" ) ||
					( len === 3 && pg === "u" && (
						args[ 1 ] === "edit" ||
						args[ 1 ] === "bin"
					) )
				) ||
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
