"use strict";

class cmpPage {
	constructor() {
		Object.seal( this );
	}

	$quit() {
		GSUdomEmpty( DOM.cmpPage );
	}
	show( cmpId ) {
		return gsapiClient.$getComposition( cmpId )
			.then( data => {
				DOM.cmpPage.append(
					PartialCmp.$domCmp( data.composition ),
					PartialCmp.$domAuthor( data.user ),
					PartialCmp.$domLikes( data.composition ),
				);
			}, err => PAGES.$main.error( err.code ) );
	}
}
