"use strict";

const mainLayer = {
	init() {
		this._nameToObj = new Map( [
			[ "",  { elem: DOM.homePage, headElem: DOM.headIcon, obj: homePage || {} } ],
			[ "u", { elem: DOM.userPage, headElem: DOM.headUser, obj: userPage } ],
		] );
		DOM.headLogout.onclick = this._logoutBtnClick.bind( this );
		DOM.pages.append.apply( DOM.pages, document.querySelectorAll( ".page" ) );
		router.on( [], ( a, b ) => this._routerFn( a[ 0 ], b[ 0 ] ) );
	},
	updateHead( u ) {
		DOM.headUser.href = `#/u/${ u.username }`;
		DOM.headUsername.textContent = u.username;
		DOM.headAvatar.style.backgroundImage = u.avatar
			? `url("${ u.avatar }?s=120")`
			: "none";
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
		apiClient.logout().then( res => {
			console.log( "logout", res );
			location.hash = "#/";
			authLayer.show();
		} );
	},
};
