"use strict";

const cmpPage = {
	_cmp: null,

	init() {
		Object.seal( this );
		GSUlistenEvents( DOM.cmpPage, {
			gsuiCmpPlayer: {
				play: ( d, t ) => { main.play( DOM.cmpPageCmp, this._cmp ); },
				stop: ( d, t ) => { main.stop(); },
			},
		} );
	},
	show( cmpId ) {
		return gsapiClient.$getComposition( cmpId )
			.then( data => {
				const u = data.user;
				const cmp = data.composition.data;

				this._cmp = cmp;
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
			}, err => main.error( err.code ) );
	},
};
