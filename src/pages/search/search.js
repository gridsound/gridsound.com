"use strict";

class gscoSearch {
	constructor() {
		Object.seal( this );
		DOM.searchPageForm.$on( {
			change: this.#onchangeForm.bind( this ),
			submit: this.#onsubmitForm.bind( this ),
		} );
		this.#updateFilter( "u" );
	}

	// .........................................................................
	$show( filter, q ) {
		this.#query( filter, q );
		GSUsetTimeout( () => DOM.searchPageFormQ.$focus(), .2 );
	}
	$update( filter, q ) {
		this.#query( filter, q );
	}
	$quit() {
		DOM.searchPageResult.$empty();
	}

	// .........................................................................
	#getFilter() {
		return DOM.searchPageForm.$query( "input[name='search-filter']:checked" ).$value();
	}
	#updateFilter( f ) {
		DOM.searchPageForm.$query( `input[value="${ f }"]` ).$prop( "checked", true );
		DOM.searchPageFormSubmit.$setAttr( "data-icon", f === "u" ? "cu-search-user" : "cu-search-music" );
	}
	#updateQInput( q ) {
		DOM.searchPageFormQ.$value( decodeURI( q ) );
	}
	#query( filter = "u", q = "" ) {
		const q2 = decodeURI( q );

		this.#updateFilter( filter );
		this.#updateQInput( q2 );
		DOM.searchPageResult.$empty();
		DOM.searchPageResultIntro.$child( 0 ).$text( "" );
		DOM.searchPageResultIntro.$child( -1 ).$text( "" );
		if ( q2 ) {
			gsapiClient.$search( filter, q2 ).then( this.#printResult.bind( this, filter, q2 ) );
		}
	}
	#onchangeForm( e ) {
		if ( e.target.type === "radio" ) {
			this.#onsubmitForm();
		}
	}
	#onsubmitForm() {
		const q = GSUtrim2( DOM.searchPageFormQ.$value() );

		location.hash = `#/q/${ this.#getFilter() }/${ q }`;
		return false;
	}
	#printResult( filter, q, arr ) {
		const len = arr.length;
		const what = ( filter === "u" ? "user" : "composition" ) + ( len < 2 ? "" : "s" );
		const limit = 20;
		const there =
			!len ? "is no" :
			len < 2 ? "is one" :
			len < limit ? `are ${ len }` :
			`are at least ${ limit }`;

		DOM.searchPageResultIntro.$child( 0 ).$text( `There ${ there } ${ what } matching ` );
		DOM.searchPageResultIntro.$child( -1 ).$text( `"${ q }"` );
		if ( filter === "u" ) {
			DOM.searchPageResult.$append( ...arr.map( u => $.$elem( "gsui-com-userlink", {
				avatar: u.avatar,
				username: u.username,
				firstname: u.firstname,
				lastname: u.lastname,
			} ) ) );
		} else {
			DOM.searchPageResult.$append( ...arr.map( cmp => gscoPartialCmp.$domCmp( cmp ) ) );
		}
	}
}
