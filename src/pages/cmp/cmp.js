"use strict";

class gscoCmp {
	#id = null;

	constructor() {
		Object.seal( this );
		DOM.cmpPageDesc.$append( gscoPartialEditText.$createForm( {
			$edit: "edit description",
			$save: "save description",
			$cancel: "cancel",
			$placeholder: "No description written yet...",
			$onsave: txt => gsapiClient.$updateCompositionDesc( this.#id, txt ),
		} ) );
	}

	// .........................................................................
	$show( cmpId ) {
		this.$quit();
		this.#id = cmpId;
		return gsapiClient.$getComposition( cmpId )
			.then( data => {
				const itsme = data.user.id === gsapiClient.$user.id;
				const desc = data.composition.description;

				DOM.cmpPageDesc
					.$css( "display", !itsme && !desc ? "none" : "" )
					.$query( ".editText-text" ).$text( desc );
				DOM.cmpPage.$prepend( gscoPartialCmp.$domCmp( {
					$u: data.user,
					$cmp: data.composition,
					$likedby: data.composition.likedby,
				} ) ).$setAttr( "data-itsme", itsme );
			}, err => PAGES.$main.$error( err.code ) );
	}
	$update( cmpId ) {
		this.$show( cmpId );
	}
	$quit() {
		this.#id = null;
		DOM.cmpPage.$query( ".player" ).$remove();
	}
}
