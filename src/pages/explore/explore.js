"use strict";

class gscoExplore {
	constructor() {
		Object.seal( this );
	}

	// .........................................................................
	$show( all ) {
		this.$update( all );
	}
	$update( all ) {
		DOM.exploreSwitch.$setAttr( "data-all", all === "all" );
	}
}
