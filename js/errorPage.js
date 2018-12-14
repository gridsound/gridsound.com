"use strict";

const errorPage = {
	show( code ) {
		DOM.errorCode.textContent = code;
		DOM.error.classList.add( "show" );
	},
	hide() {
		DOM.error.classList.remove( "show" );
	}
};
