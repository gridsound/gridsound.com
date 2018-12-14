"use strict";

const mainLayer = {
	init() {
		const pages = document.querySelectorAll( ".page" ),
			nameToObj = new Map( [
				[ "", { obj: homePage || {}, elem: DOM.homePage } ],
				[ "u", { obj: userPage, elem: DOM.userPage } ],
			] );

		DOM.headLogout.onclick = this._logoutBtnClick.bind( this );
		DOM.pages.append.apply( DOM.pages, pages );
		router.on( [], ( [ path0 ], [ prevPath0 ] ) => {
			if ( path0 !== prevPath0 ) {
				const prev = nameToObj.get( prevPath0 ),
					page = nameToObj.get( path0 );

				if ( prev ) {
					prev.elem.classList.remove( "show" );
					if ( prev.obj.hide ) {
						prev.obj.hide();
					}
				}
				if ( !page ) {
					location.href = "#/";
				} else {
					page.elem.classList.add( "show" );
					if ( page.obj.show ) {
						page.obj.show();
					}
				}
			}
		} );
	},
	updateHead( u ) {
		DOM.headUser.href = `#/u/${ u.username }`;
		DOM.headUsername.textContent = u.username;
		DOM.headAvatar.style.backgroundImage = u.avatar
			? `url("${ u.avatar }?s=120")`
			: "none";
	},

	// private:
	_logoutBtnClick() {
		apiClient.logout().then( res => {
			console.log( "logout", res );
			location.hash = "#/";
			authLayer.show();
		} );
	},
};
