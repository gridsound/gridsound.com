"use strict";

const main = {
	init() {
		this._nameToObj = new Map( [
			[ "",     { elem: DOM.homePage, headElem: DOM.headIcon, obj: homePage || {} } ],
			[ "u",    { elem: DOM.userPage, headElem: DOM.headUser, obj: userPage } ],
			[ "auth", { elem: DOM.authPage, headElem: DOM.headAuth, obj: authPage } ],
		] );
		DOM.headAuth.onclick = this._logoutBtnClick.bind( this );
		DOM.pages.append.apply( DOM.pages, document.querySelectorAll( ".page" ) );
		router.on( [], ( a, b ) => this._routerFn( a[ 0 ], b[ 0 ] ) );
	},
	loggedIn( u ) {
		DOM.headAuth.removeAttribute( "href" );
		DOM.headUser.href = `#/u/${ u.username }`;
		DOM.headUsername.textContent = u.username;
		DOM.headAvatar.style.backgroundImage = u.avatar
			? `url("${ u.avatar }?s=120")`
			: "none";
		DOM.main.classList.remove( "noauth" );
	},

	// private:
	_routerFn( path0, prevPath0 ) {
		errorPage.hide();
		if ( path0 !== prevPath0 ) {
			const prev = this._nameToObj.get( prevPath0 ),
				page = this._nameToObj.get( path0 );

			if ( prev ) {
				prev.elem.classList.remove( "show" );
				prev.headElem.classList.remove( "selected" );
				if ( prev.obj.hide ) {
					prev.obj.hide();
				}
			}
			if ( !page ) {
				errorPage.show( 404 );
			} else {
				page.elem.classList.add( "show" );
				page.headElem.classList.add( "selected" );
				if ( page.obj.show ) {
					page.obj.show();
				}
			}
		}
	},
	_logoutBtnClick() {
		if ( !DOM.headAuth.href ) {
			apiClient.logout().then( res => {
				console.log( "logout", res );
			} );
		}
	},
};
