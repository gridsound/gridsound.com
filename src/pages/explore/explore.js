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
		GSUdomSetAttr( DOM.exploreSwitch, "data-all", all === "all" );
	}
}
