"use strict";

class homePage {
	#cmp = null;

	constructor() {
		Object.seal( this );
	}

	show() {
		GSUsetTimeout( () => {
			DOM.homePage.classList.add( "startAnim" );
			GSUsetTimeout( () => DOM.homePage.classList.add( "loopAnim" ), 1 );
		}, .05 );
	}
	$quit() {
		DOM.homePage.classList.remove( "startAnim", "loopAnim" );
	}
}
