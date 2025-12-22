"use strict";

class searchPage {
	constructor() {
		Object.seal( this );
		DOM[ "searchPage-form" ].onchange = this.#onchangeForm.bind( this );
		DOM[ "searchPage-form" ].onsubmit = this.#onsubmitForm.bind( this );
		this.#updateFilter( "u" );
	}

	// .........................................................................
	$show( filter, q ) {
		this.#query( filter, q );
		GSUsetTimeout( () => {
			DOM[ "searchPage-form-q" ].focus();
		}, .2 );
	}
	$update( filter, q ) {
		this.#query( filter, q );
	}
	$quit() {
		GSUdomEmpty( DOM.searchPageResult );
	}

	// .........................................................................
	#getFilter() {
		return GSUdomQS( DOM[ "searchPage-form" ], "input[name='search-filter']:checked" ).value;
	}
	#updateFilter( f ) {
		GSUdomQS( DOM[ "searchPage-form" ], `input[value="${ f }"]` ).checked = true;
		GSUdomSetAttr( DOM[ "searchPage-form-submit" ], "data-icon", f === "u" ? "cu-search-user" : "cu-search-music" );
	}
	#updateQInput( q ) {
		DOM[ "searchPage-form-q" ].value = decodeURI( q );
	}
	#query( filter = "u", q = "" ) {
		const q2 = decodeURI( q );

		this.#updateFilter( filter );
		this.#updateQInput( q2 );
		GSUdomEmpty( DOM.searchPageResult );
		DOM.searchPageResultIntro.firstChild.textContent =
		DOM.searchPageResultIntro.lastChild.textContent = "";
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
		const q = GSUtrim2( DOM[ "searchPage-form-q" ].value );

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

		DOM.searchPageResultIntro.firstChild.textContent = `There ${ there } ${ what } matching `;
		DOM.searchPageResultIntro.lastChild.textContent = `"${ q }"`;
		if ( filter === "u" ) {
			DOM.searchPageResult.append( ...arr.map( u => GSUcreateElement( "gsui-com-userlink", {
				avatar: u.avatar,
				username: u.username,
				firstname: u.firstname,
				lastname: u.lastname,
			} ) ) );
		} else {
			DOM.searchPageResult.append( ...arr.map( cmp => PartialCmp.$domCmp( cmp ) ) );
		}
	}
}
