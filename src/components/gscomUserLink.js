"use strict";

class gscomUserLink extends gsui0ne {
	constructor() {
		super( {
			$cmpName: "gscomUserLink",
			$tagName: "gscom-userlink",
			$template: 	GSUcreateA( { class: "gscomUserLink-a" },
				GSUcreateIcon( { icon: "musician" } ),
				GSUcreateDiv( { class: "gscomUserLink-avatar" } ),
				GSUcreateSpan( { class: "gscomUserLink-username" } ),
				GSUcreateSpan( { class: "gscomUserLink-name" } ),
			),
			$elements: {
				$a: ".gscomUserLink-a",
				$name: ".gscomUserLink-name",
				$avatar: ".gscomUserLink-avatar",
				$username: ".gscomUserLink-username",
			},
		} );
		Object.seal( this );
	}

	static get observedAttributes() {
		return [ "username", "firstname", "lastname", "avatar" ];
	}
	$attributeChanged( prop, val ) {
		switch ( prop ) {
			case "firstname":
			case "lastname": this.#updateName(); break;
			case "avatar": GSUdomStyle( this.$elements.$avatar, "backgroundImage", `url(${ val })` ); break;
			case "username": this.#updateUsername( val ); break;
		}
	}

	#updateUsername( n ) {
		this.$elements.$a.href = `#/u/${ n }`;
		this.$elements.$username.textContent = n;
	}
	#updateName() {
		const a = GSUdomGetAttr( this, "firstname" );
		const b = GSUdomGetAttr( this, "lastname" );

		this.$elements.$name.textContent = a && b
			? `${ a } ${ b }`
			: a || b || "";
	}
}

GSUdomDefine( "gscom-userlink", gscomUserLink );
