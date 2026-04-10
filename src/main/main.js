"use strict";

class gscoMain {
	#pageName = null;
	#timeoutIdPageChange = null;
	#statusBefore = Object.seal( {
		headLinkBefore: $noop,
		pageBefore: $noop,
	} );
	#pages = Object.freeze( {
		"":             [ DOM.homePage,       DOM.headIcon,    PAGES.$home ],
		q:              [ DOM.searchPage,     DOM.headSearch,  PAGES.$search ],
		u:              [ DOM.userPage,       DOM.headUser,    PAGES.$user ],
		cmp:            [ DOM.cmpPage,        null,            PAGES.$cmp ],
		auth:           [ DOM.authPage,       DOM.headAuth,    PAGES.$auth ],
		logs:           [ DOM.logsPage,       null,            PAGES.$logs ],
		explore:        [ DOM.explorePage,    DOM.headExplore, PAGES.$explore ],
		resetPassword:  [ DOM.resetpassPage,  DOM.headAuth,    PAGES.$resetpass ],
		forgotPassword: [ DOM.forgotpassPage, DOM.headAuth,    PAGES.$forgotpass ],
	} );
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

		DOM.headAuth.$onclick( this.#headAuthBtnClick.bind( this ) );
		$body.$on( "scroll", onscroll );
		GSUdomObserveSize( $body.$get( 0 ), onscroll );
		window.onhashchange = () => this.#hashChange();
		GSUdomListen( DOM.main.$get( 0 ), {
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
		DOM.headAuth.$setAttr( {
			"data-spin": "",
			"data-icon": "logout",
			title: "Logout",
			href: "",
		} );
		DOM.headUser.$setAttr( "href", `#/u/${ u.username }` );
		DOM.headUsername.$text( u.username );
		DOM.root.$rmClass( "noauth" );
		DOM.headAvatar.$setAttr( "src", u.avatar );
	}
	$error( code ) {
		DOM.errorCode.$text( code );
		DOM.error.$addClass( "show" );
		this.#toggleClass( null, "headLinkBefore", "selected" );
	}

	// .........................................................................
	#onplay( e ) {
		DOM.userPage.$query( "gsui-com-player[playing]" ).$each( elCmp => {
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
		const y128 = DOM.userPageProfile.$get( 0 ).$isSmall()
			? Math.min( y, 64 ) / 64
			: Math.min( y, 118 ) / 118;
		const st = {
			"--y32": Math.min( y, 32 ) / 32,
			"--y128": y128,
		};
		const sticky = y128 >= 1 ? "bottom" : true;

		DOM.head.$css( st );
		DOM.userPageTop.$css( st );
		DOM.searchPageForm.$css( st );
		DOM.searchPageForm.$setAttr( "data-head-sticky-shadow", sticky );
		DOM.userPageProfileMenu.$setAttr( "data-head-sticky-shadow", sticky );
		gscoMain.#onscrollCmpPlaying( this.#pageName );
		gscoMain.#onscrollBg();
	}
	static #onscrollCmpPlaying( page ) {
		const elCmp = $( "gsui-com-player[playing]" );

		if ( elCmp.$size() ) {
			const { top, bottom } = elCmp.$bcr();
			let shad = false;

			if ( top <= 142 && page === "q" ) {
				DOM.searchPageForm.$rmAttr( "data-head-sticky-shadow" );
				shad = "bottom";
			} else if ( top <= 170 && page === "u" ) {
				DOM.userPageProfileMenu.$rmAttr( "data-head-sticky-shadow" );
				shad = "bottom";
			} else if ( bottom >= $html.$get( 0 ).offsetHeight - 5 ) {
				shad = "top";
			}
			elCmp.$setAttr( "data-head-sticky-shadow", shad );
		}
	}
	static #onscrollBg() {
		if ( $html.$scrollY() < 200 ) {
			DOM.root.$css( "--gscom-scroll", 0 );
		} else {
			const startTop = 200;
			const scrollSize = Math.max( 2000, $html.$scrollH() - $html.$get( 0 ).offsetHeight );
			const p = GSUmathFix( ( $html.$scrollY() - startTop ) / scrollSize, 3 );

			DOM.root.$css( "--gscom-scroll", p );
		}
	}
	#showPage( pageName, args ) {
		const [ page, headLink, pageObj ] = this.#pages[ pageName ];

		DOM.error.$rmClass( "show" );
		if ( pageName === this.#pageName ) {
			pageObj?.$update?.( ...args );
		} else {
			this.#pages[ this.#pageName ]?.[ 2 ]?.$quit?.();
			this.#pageName = pageName;
			DOM.loader.$addClass( "show" );
			this.#toggleClass( headLink, "headLinkBefore", "selected" );
			this.#toggleClass( page, "pageBefore", "show" );
			GSUclearTimeout( this.#timeoutIdPageChange );
			this.#timeoutIdPageChange = GSUsetTimeout( () => {
				Promise.resolve( pageObj?.$show?.( ...args ) )
					.finally( () => DOM.loader.$rmClass( "show" ) );
			}, .25 );
		}
		if ( pageName === "u" ) {
			const itsme = args[ 0 ].toLowerCase() === gsapiClient.$user.usernameLow;

			this.#toggleClass( itsme ? headLink : null, "headLinkBefore", "selected" );
		}
	}
	#toggleClass( el, prevAttr, clazz ) {
		const elPrev = this.#statusBefore[ prevAttr ];

		if ( !elPrev.$is( el ) ) {
			elPrev.$rmClass( clazz );
			el?.$addClass( clazz );
			this.#statusBefore[ prevAttr ] = el || $noop;
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

		if ( !btn.$getAttr( "href" ) && btn.$getAttr( "data-spin" ) !== "on" ) {
			btn.$setAttr( "data-spin", "on" );
			gsapiClient.$logoutRefresh().catch( () => btn.$rmAttr( "data-spin", "on" ) );
			return false;
		}
	}
}
