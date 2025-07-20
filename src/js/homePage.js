"use strict";

class homePage {
	#cmp = null;

	constructor() {
		Object.seal( this );
	}

	show() {
		GSUsetTimeout( () => {
			GSUdomAddClass( DOM.homePage, "startAnim" );
			GSUsetTimeout( () => GSUdomAddClass( DOM.homePage, "loopAnim" ), 1 );
		}, .05 );
	}
	$quit() {
		GSUdomRmClass( DOM.homePage, "startAnim", "loopAnim" );
	}
}
