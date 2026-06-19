"use strict";

class gscoExplore {
	constructor() {
		Object.seal( this );
	}

	// .........................................................................
	$show( all ) {
		this.$update( all );
	}
	$quit() {
		DOM.exploreBody.$empty();
	}
	$update( all ) {
		const all2 = all === "all"
		const nbFollow = gsapiClient.$user.following;
		const intro =
			all2 ? GSTX.$explore_all :
			nbFollow === 1 ? GSTX.$explore_you1 :
			nbFollow === 0 ? GSTX.$explore_you0 :
			!nbFollow ? GSTX.$explore_who :
			GSTXreplace( GSTX.$explore_you, gsapiClient.$user.following );

		DOM.exploreSwitch.$setAttr( "data-all", all2 );
		DOM.exploreBody.$empty();
		DOM.exploreIntro.$textHTML( intro );
		// show loading...
		( all2
			? gsapiClient.$getAllActivities()
			: gsapiClient.$getMyActivities()
		).then( obj => {
			// hide loading...
			DOM.exploreBody.$append( ...obj.map( gscoExplore.#createItem ) );
		} );
	}

	// .........................................................................
	static #msgs = GSUdeepFreeze( {
		newcmp: GSTX.$explore_newCmp,
		render: GSTX.$explore_newRender,
		like: GSTX.$explore_newLike,
	} );
	static #createItem( o ) {
		return $.$div( { class: "explore-item", "data-what": o.type },
			$.$div( { class: "explore-item-head" },
				$.$elem( "gsui-com-userlink", o.$actor ),
				$.$bold( null, gscoExplore.#msgs[ o.type ] || "???" ),
			),
			gscoPartialCmp.$domCmp( {
				$u: o.$author,
				$cmp: o.$cmp,
			} ),
		);
	}
}
