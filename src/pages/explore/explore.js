"use strict";

class explorePage {
	constructor() {
		Object.seal( this );
	}

	show( all ) {
		this.$update( all );
	}
	$update( all ) {
		GSUdomSetAttr( DOM.exploreSwitch, "data-all", all === "all" );
	}
}
