"use strict";

class cmpPage {
	#cmp = null;

	constructor() {
		Object.seal( this );
		GSUlistenEvents( DOM.cmpPage, {
			gsuiComPlayer: {
				play: ( d, t ) => { PAGES.$main.play( DOM.cmpPageCmp, this.#cmp ); },
				stop: ( d, t ) => { PAGES.$main.stop(); },
			},
		} );
	}

	show( cmpId ) {
		return gsapiClient.$getComposition( cmpId )
			.then( data => {
				const u = data.user;
				const cmp = data.composition.data;

				this.#cmp = cmp;
				GSUsetAttribute( DOM.cmpPageCmp, {
					"data-id": cmp.id,
					name: cmp.name,
					bpm: cmp.bpm,
					duration: cmp.duration * 60 / cmp.bpm,
				} );
				DOM.cmpPageAuthor.href = `#/u/${ u.username }`;
				DOM.cmpPageAuthorAvatar.style.backgroundImage = `url(${ u.avatar })`;
				DOM.cmpPageAuthorUsername.textContent = u.username;
				DOM.cmpPageAuthorName.textContent = u.firstname || u.lastname
					? `${ u.firstname } ${ u.lastname }`
					: "";
			}, err => PAGES.$main.error( err.code ) );
	}
}
