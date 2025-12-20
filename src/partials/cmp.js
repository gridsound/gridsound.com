"use strict";

class PartialCmp {
	static $domAuthor( u ) {
		return GSUcreateElement( "gsui-com-userlink", {
			avatar: u.avatar,
			username: u.username,
			firstname: u.firstname,
			lastname: u.lastname,
		} );
	}
	static $domLikes( cmp ) {
		const elems = cmp.likedby.flatMap( ( u, i ) => [
			i ? GSUcreateSpan( null, ", " ) : '',
			GSUcreateA( { href: `#/u/${ u }` }, u ),
		] );

		return GSUcreateDiv( { class: "cmp-likes" }, ...elems );
	}
	static $domCmp( cmp ) {
		const del = !!cmp.deleted;
		const itsmine = gsapiClient.$user.id === cmp.iduser;
		const elCmp = GSUcreateElement( "gsui-com-player", {
			itsmine,
			"data-id": cmp.id,
			name: cmp.name,
			bpm: cmp.bpm,
			private: !cmp.public,
			opensource: cmp.opensource,
			duration: cmp.durationSec,
			rendered: !!cmp.rendered,
			dawlink: del || !( itsmine || cmp.opensource ) ? false : `${ DAWURL }#${ cmp.id }`,
			likes: cmp.likes,
			liked: cmp.liked,
		} );

		elCmp.$setLikeCallbackPromise( PartialCmp.#cbLike );
		elCmp.$setRendersCallbackPromise( PartialCmp.#cbGetRender );
		return elCmp;
	}
	static #cbLike( el, act ) {
		return gsapiClient.$likeComposition( el.dataset.id, act );
	}
	static #cbGetRender( el ) {
		return gsapiClient.$getCompositionRenders( el.dataset.id ).then( arr => arr[ 0 ]?.url );
	}
}
