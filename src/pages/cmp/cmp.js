"use strict";

class cmpPage {
	constructor() {
		Object.seal( this );
	}

	$quit() {
		GSUdomSetAttr( DOM.cmpPageCmp, "playing", false );
	}
	show( cmpId ) {
		return gsapiClient.$getComposition( cmpId )
			.then( data => {
				const u = data.user;
				const cmp = data.composition;
				const itsmine = gsapiClient.$user.id === cmp.iduser;
				const del = !!cmp.deleted;

				GSUdomSetAttr( DOM.cmpPageCmp, {
					itsmine,
					"data-id": cmp.id,
					name: cmp.name,
					bpm: cmp.bpm,
					private: !cmp.public,
					opensource: cmp.opensource,
					duration: cmp.durationSec,
					url: `https://compositions.gridsound.com/${ cmp.id }.opus`,
					dawlink: del || !( itsmine || cmp.opensource ) ? false : `${ DAWURL }#${ cmp.id }`,
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
