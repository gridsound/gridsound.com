"use strict";

class gscoLoader extends gsui0ne {
	constructor() {
		super( {
			$tagName: "gsco-loader",
			$template: $.$icon( { spin: true } ),
		} );
	}
}

$.$define( "gsco-loader", gscoLoader );
