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
	static #createItem( o ) {
		const elems = [];
		const t = o.type;

		switch ( t ) {
			case "like":
			case "render":
				elems.push(
					$.$div( { class: "explore-item-head" },
						$.$elem( "gsui-com-userlink", {
							avatar:    o.actor_avatar,
							username:  o.actor_username,
							firstname: o.actor_firstname,
							lastname:  o.actor_lastname,
						} ),
						$.$bold( null, t === "like" ? GSTX.$hasLiked : GSTX.$hasExported ),
					),
					gscoPartialCmp.$domCmp( {
						$cmp: {
        					id:         o.cmp_id,
        					iduser:     o.cmp_iduser,
        					likes:      o.cmp_likes,
        					liked:      o.cmp_liked,
        					bpm:        o.cmp_bpm,
        					name:       o.cmp_name,
        					opensource: o.cmp_opensource,
        					public:     o.cmp_public,
        					duration:   o.cmp_duration,
        					rendered:   o.cmp_rendered,
						},
						$u: {
							avatar:    o.author_avatar,
							username:  o.author_username,
							firstname: o.author_firstname,
							lastname:  o.author_lastname,
						},
					} ),
				);
				break;
		}
		return $.$div( { class: "explore-item", "data-what": t }, elems );
	}
}
