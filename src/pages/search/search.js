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
		DOM.searchPageFormSubmit.$child( 0 ).$setAttr( "icon", f === "u" ? "cu-search-user" : "cu-search-music" );
	}
	#updateQInput( q ) {
		DOM.searchPageFormQ.$value( decodeURI( q ) );
	}
	#query( filter = "u", q = "" ) {
		const q2 = decodeURI( q );

		this.#updateFilter( filter );
		this.#updateQInput( q2 );
		DOM.searchPageResult.$empty();
		DOM.searchPageResultIntro.$empty();
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
		const isU = filter === "u";
		const txt =
			len === 0 ? isU ? GSTX.$search_user_0   : GSTX.$search_cmps_0 :
			len === 1 ? isU ? GSTX.$search_user_1   : GSTX.$search_cmps_1 :
			len < 20  ? isU ? GSTX.$search_user_n   : GSTX.$search_cmps_n :
			            isU ? GSTX.$search_user_max : GSTX.$search_cmps_max;

		DOM.searchPageResultIntro.$textHTML( GSTXreplace( txt, q, len ) );
		DOM.searchPageResult.$append( ...arr.map( isU
			? u => gscoPartialCmp.$domAuthor( u )
			: cmp => gscoPartialCmp.$domCmp( { $cmp: cmp } ) ) );
	}
}
