"use strict";

class homePage {
	#cmp = null;

	constructor() {
		Object.seal( this );
	}

	show() {
		setTimeout( () => {
			DOM.homePage.classList.add( "startAnim" );
			setTimeout( () => DOM.homePage.classList.add( "loopAnim" ), 1000 );
		}, 50 );
	}
	$quit() {
		DOM.homePage.classList.remove( "startAnim", "loopAnim" );
	}
}
