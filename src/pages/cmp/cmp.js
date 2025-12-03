"use strict";

class cmpPage {
	constructor() {
		Object.seal( this );
	}

	$quit() {
		GSUdomEmpty( DOM.cmpPageLikes );
		GSUdomSetAttr( DOM.cmpPageCmp, "playing", false );
	}
	show( cmpId ) {
		return gsapiClient.$getComposition( cmpId )
			.then( data => {
				const u = data.user;
				const cmp = data.composition;
				const itsmine = gsapiClient.$user.id === cmp.iduser;
				const del = !!cmp.deleted;

				DOM.cmpPageLikes.append(
					...cmp.likedby.flatMap( ( u, i ) => [
						i ? GSUcreateSpan( null, ", " ) : '',
						GSUcreateA( { href: `#/u/${ u }` }, u ),
					] )
				);
				DOM.cmpPageCmp.$setLikeCallbackPromise( ( el, act ) => gsapiClient.$likeComposition( el.dataset.id, act ) );
				DOM.cmpPageCmp.$setRendersCallbackPromise( el => gsapiClient.$getCompositionRenders( el.dataset.id ).then( arr => arr[ 0 ]?.url ) );
				GSUdomSetAttr( DOM.cmpPageCmp, {
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
				GSUdomSetAttr( DOM.cmpPageUserLink, {
					avatar: u.avatar,
					username: u.username,
					firstname: u.firstname,
					lastname: u.lastname,
				} );
			}, err => PAGES.$main.error( err.code ) );
	}
}
