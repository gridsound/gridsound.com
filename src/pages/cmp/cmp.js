"use strict";

class gscoCmp {
	constructor() {
		Object.seal( this );
	}

	// .........................................................................
	$show( cmpId ) {
		return gsapiClient.$getComposition( cmpId )
			.then( data => {
				DOM.cmpPage.$append( gscoPartialCmp.$domCmp( {
					$u: data.user,
					$cmp: data.composition,
					$likedby: data.composition.likedby,
				} ) );
			}, err => PAGES.$main.$error( err.code ) );
	}
	$update( cmpId ) {
		this.$quit();
		this.$show( cmpId );
	}
	$quit() {
		DOM.cmpPage.$empty();
	}
}
