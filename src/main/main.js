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
	static $routes = Object.freeze( [
		/^#\/$/,
		/^#\/u\/.+(\/bin|\/likes)?$/,
		/^#\/explore(\/all)?$/,
		/^#\/q(\/u|\/cmp)?$/,
		/^#\/q(\/u|\/cmp)(\/.+)?$/,
		/^#\/cmp\/.+$/,
		/^#\/auth$/,
		/^#\/logs$/,
		/^#\/resetPassword\/.+\/.+$/,
		/^#\/forgotPassword$/,
	] );

	constructor() {
		DOM.headAuth.onclick = this.#headAuthBtnClick.bind( this );
		window.onhashchange = () => this.#hashChange();
	}

	// .........................................................................
	$run() {
		this.#hashChange();
	}
	$loggedIn( u ) {
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
	$error( code ) {
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
				Promise.resolve( pageObj?.$show?.( ...args ) )
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
		const h = location.hash;

		GSUdomSetAttr( document.body, "data-hash", h );
		if ( !h ) {
			location.hash = "#/";
		} else if ( h !== "#/" && h.endsWith( "/" ) ) {
			location.hash = h.substring( 0, h.length - 1 );
		} else if ( !main.$routes.some( r => r.test( h ) ) ) {
			this.$error( 404 );
		} else {
			const arr = h.split( "/" );
			const [ , pg, ...args ] = arr;

			this.#showPage( pg, args );
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
