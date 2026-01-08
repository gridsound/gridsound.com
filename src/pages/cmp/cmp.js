"use strict";

class gscoCmp {
	constructor() {
		Object.seal( this );
	}

	// .........................................................................
	$show( cmpId ) {
		return gsapiClient.$getComposition( cmpId )
			.then( data => {
				DOM.cmpPage.append(
					gscoPartialCmp.$domCmp( data.composition ),
					gscoPartialCmp.$domAuthor( data.user ),
					gscoPartialCmp.$domLikes( data.composition ),
				);
			}, err => PAGES.$main.$error( err.code ) );
	}
	$quit() {
		GSUdomEmpty( DOM.cmpPage );
	}
}
