"use strict";

class gscoMain {
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
		/^#\/$/u,
		/^#\/u\/.+(\/bin|\/likes)?$/u,
		/^#\/explore(\/all)?$/u,
		/^#\/q(\/u|\/cmp)?$/u,
		/^#\/q(\/u|\/cmp)(\/.+)?$/u,
		/^#\/cmp\/.+$/u,
		/^#\/auth$/u,
		/^#\/logs$/u,
		/^#\/resetPassword\/.+\/.+$/u,
		/^#\/forgotPassword$/u,
	] );

	constructor() {
		const onscroll = this.#onscroll.bind( this );

		DOM.headAuth.onclick = this.#headAuthBtnClick.bind( this );
		$body.$on( "scroll", onscroll );
		GSUdomObserveSize( $body.$get( 0 ), onscroll );
		window.onhashchange = () => this.#hashChange();
		GSUdomListen( DOM.main, {
			[ GSEV_COMPLAYER_PLAY ]: this.#onplay.bind( this ),
			[ GSEV_COMPLAYER_STOP ]: this.#onstop.bind( this ),
		} );
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
	#onplay( e ) {
		$( DOM.userPage, "gsui-com-player[playing]" ).$each( elCmp => {
			if ( elCmp !== e.$target ) {
				elCmp.$pause();
			}
		} );
		GSUsetTimeout( () => this.#onscroll(), .1 );
	}
	#onstop( e ) {
		GSUdomRmAttr( e.$target, "data-head-sticky-shadow" );
		GSUsetTimeout( () => this.#onscroll(), .1 );
	}
	#onscroll() {
		const y = $html.$scrollY() | 0;
		const y128 = DOM.userPageProfile.$isSmall()
			? Math.min( y, 64 ) / 64
			: Math.min( y, 118 ) / 118;
		const st = {
			"--y32": Math.min( y, 32 ) / 32,
			"--y128": y128,
		};

		GSUdomStyle( DOM.head, st );
		GSUdomStyle( DOM.userPageTop, st );
		GSUdomStyle( DOM.searchPageForm, st );
		GSUdomSetAttr( DOM.searchPageForm, "data-head-sticky-shadow", y128 >= 1 ? "bottom" : true );
		GSUdomSetAttr( DOM.userPageProfileMenu, "data-head-sticky-shadow", y128 >= 1 ? "bottom" : true );
		gscoMain.#onscrollCmpPlaying( this.#pageName );
		gscoMain.#onscrollBg();
	}
	static #onscrollCmpPlaying( page ) {
		const elCmp = $( "gsui-com-player[playing]" );

		if ( elCmp.$size() ) {
			const { top, bottom } = elCmp.$bcr();
			let shad = false;

			if ( top <= 142 && page === "q" ) {
				GSUdomRmAttr( DOM.searchPageForm, "data-head-sticky-shadow" );
				shad = "bottom";
			} else if ( top <= 170 && page === "u" ) {
				GSUdomRmAttr( DOM.userPageProfileMenu, "data-head-sticky-shadow" );
				shad = "bottom";
			} else if ( bottom >= $html.$get( 0 ).offsetHeight - 5 ) {
				shad = "top";
			}
			elCmp.$setAttr( "data-head-sticky-shadow", shad );
		}
	}
	static #onscrollBg() {
		if ( $html.$scrollY() < 200 ) {
			GSUdomStyle( DOM.root, "--gscom-scroll", 0 );
		} else {
			const startTop = 200;
			const scrollSize = Math.max( 2000, $html.$scrollH() - $html.$get( 0 ).offsetHeight );
			const p = GSUmathFix( ( $html.$scrollY() - startTop ) / scrollSize, 3 );

			GSUdomStyle( DOM.root, "--gscom-scroll", p );
		}
	}
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

		$body.$setAttr( "data-hash", h );
		if ( !h ) {
			location.hash = "#/";
		} else if ( h !== "#/" && h.endsWith( "/" ) ) {
			location.hash = h.substring( 0, h.length - 1 );
		} else if ( !gscoMain.$routes.some( r => r.test( h ) ) ) {
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
