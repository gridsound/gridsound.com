"use strict";

class gscoPartialCmp {
	static $domAuthor( u ) {
		return $.$elem( "gsui-com-userlink", {
			avatar: u.avatar,
			username: u.username,
			firstname: u.firstname,
			lastname: u.lastname,
		} );
	}
	static $domLikes( cmp ) {
		const elems = cmp.likedby.flatMap( ( u, i ) => [
			i ? $.$span( null, ", " ) : "",
			$.$link( { href: `#/u/${ u }` }, u ),
		] );

		return $.$div( { class: "cmp-likes" }, ...elems );
	}
	static $domCmp( cmp ) {
		const itsmine = gsapiClient.$user.id === cmp.iduser;
		const elCmp = $.$elem( "gsui-com-player", {
			"data-id": cmp.id,
			itsmine,
			bpm: cmp.bpm,
			name: cmp.name,
			link: `#/cmp/${ cmp.id }`,
			likes: cmp.likes,
			liked: cmp.liked,
			private: !cmp.public,
			deleted: !!cmp.deleted,
			rendered: !!cmp.rendered,
			duration: cmp.durationSec,
			opensource: cmp.opensource,
			dawlink: !cmp.deleted && ( itsmine || cmp.opensource ) ? `${ gscoDAWURL }#${ cmp.id }` : false,
		} );

		gscoPartialCmp.$updateCmpActions( elCmp );
		elCmp.$setLikeCallbackPromise( gscoPartialCmp.#cbLike );
		elCmp.$setForkCallbackPromise( gscoPartialCmp.#cbFork );
		elCmp.$setRendersCallbackPromise( gscoPartialCmp.#cbGetRender );
		if ( itsmine ) {
			elCmp.$setDeleteCallbackPromise( gscoPartialCmp.#cbDelete );
			elCmp.$setRestoreCallbackPromise( gscoPartialCmp.#cbRestore );
			elCmp.$setVisibilityCallbackPromise( gscoPartialCmp.#cbPublic );
		}
		return elCmp;
	}
	static $updateCmpActions( elCmp ) {
		const cmp = $( elCmp );
		const open = cmp.$hasAttr( "opensource" );
		const priv4te = cmp.$hasAttr( "private" );
		let actions;

		if ( cmp.$hasAttr( "itsmine" ) ) {
			if ( cmp.$hasAttr( "deleted" ) ) {
				actions = "restore";
			} else {
				actions = "fork delete";
				if ( gsapiClient.$user.premium ) {
					if ( !open ) { actions += " open"; }
					if ( open || priv4te ) { actions += " visible"; }
					if ( !priv4te ) { actions += " private"; }
				}
			}
		} else if ( open ) {
			actions = "fork";
		}
		cmp.$setAttr( "actions", actions );
	}
	static #cbFork( el ) { return gsapiClient.$forkComposition( el.dataset.id ).catch( err => { throw err.msg; } ); }
	static #cbDelete( el ) { return gsapiClient.$deleteComposition( el.dataset.id ).catch( err => { throw err.msg; } ); }
	static #cbRestore( el ) { return gsapiClient.$restoreComposition( el.dataset.id ).catch( err => { throw err.msg; } ); }
	static #cbGetRender( el ) { return gsapiClient.$getCompositionRenders( el.dataset.id ).then( arr => arr[ 0 ]?.url ); }
	static #cbLike( el, act ) { return gsapiClient.$likeComposition( el.dataset.id, act ); }
	static #cbPublic( el, vis ) { return gsapiClient.$changeCompositionVisibility( el.dataset.id, vis ).catch( err => { throw err.msg; } ); }
}
