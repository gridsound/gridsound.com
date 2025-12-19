"use strict";

class main {
	#pageName = null;
	#timeoutIdPageChange = null;
	$pages = {
		"":             [ DOM.homePage,       DOM.headIcon,    PAGES.$home ],
		q:              [ DOM.searchPage,     DOM.headSearch,  PAGES.$search ],
		u:              [ DOM.userPage,       DOM.headUser,    PAGES.$user ],
		cmp:            [ DOM.cmpPage,        null,            PAGES.$cmp ],
		auth:           [ DOM.authPage,       DOM.headAuth,    PAGES.$auth ],
		logs:           [ DOM.logsPage,       null,            PAGES.$logs ],
		explore:        [ DOM.explorePage,    DOM.headExplore, PAGES.$explore ],
		resetPassword:  [ DOM.resetpassPage,  DOM.headAuth,    PAGES.$resetpass ],
		forgotPassword: [ DOM.forgotpassPage, DOM.headAuth,    PAGES.$forgotpass ],
	};

	constructor() {
		DOM.headAuth.onclick = this.#headAuthBtnClick.bind( this );
		window.onhashchange = () => this.#hashChange();
	}

	run() {
		this.#hashChange();
	}
	loggedIn( u ) {
		gsapiClient.$setIntervalPing();
		GSUdomSetAttr( DOM.headAuth, {
			"data-spin": "",
			"data-icon": "logout",
			title: "Logout",
			href: "",
		} );
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

		GSUdomRmClass( DOM.error, "show" );
		if ( pageName === this.#pageName ) {
			pageObj?.$update?.( ...args );
		} else {
			this.$pages[ this.#pageName ]?.[ 2 ]?.$quit?.();
			this.#pageName = pageName;
			GSUdomAddClass( DOM.loader, "show" );
			this.#toggleClass( headLink, "headLinkBefore", "selected" );
			this.#toggleClass( page, "pageBefore", "show" );
			GSUclearTimeout( this.#timeoutIdPageChange );
			this.#timeoutIdPageChange = GSUsetTimeout( () => {
				Promise.resolve( pageObj?.show?.( ...args ) )
					.finally( () => GSUdomRmClass( DOM.loader, "show" ) );
			}, .25 );
		}
		if ( pageName === "u" ) {
			const itsme = args[ 0 ].toLowerCase() === gsapiClient.$user.usernameLow;

			this.#toggleClass( itsme ? headLink : null, "headLinkBefore", "selected" );
		}
	}
	#toggleClass( el, prevAttr, clazz ) {
		const elPrev = this[ prevAttr ];

		if ( el !== elPrev ) {
			GSUdomRmClass( elPrev, clazz );
			GSUdomAddClass( el, clazz );
			this[ prevAttr ] = el || undefined;
		}
	}
	#hashChange() {
		const hash = location.hash;

		if ( !hash ) {
			location.hash = "#/";
		} else if ( hash !== "#/" && hash.endsWith( "/" ) ) {
			location.hash = hash.substring( 0, hash.length - 1 );
		} else {
			const arr = hash.split( "/" );
			const len = arr.length - 1;
			const [ , pg, ...args ] = arr;
			const [ a0 ] = args;

			if (
				( len === 2 && pg === "u" ) ||
				( pg === "q" ) ||
				( pg === "logs" ) ||
				( len <= 2  && pg === "explore" && ( !a0 || a0 === "all" ) ) ||
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
			gsapiClient.$logoutRefresh().catch( () => GSUdomRmAttr( btn, "data-spin" ) );
			return false;
		}
	}
}
