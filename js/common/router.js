"use strict";

const router = {
	init() {
		this._callbacks = [];
		this._previousHash = [];
		window.addEventListener( "hashchange", this._onhashchange.bind( this ), false );
	},

	run( hashDefault ) {
		const h = location.hash;

		if ( h.startsWith( "#/" ) ) {
			this._onhashchange();
		} else {
			location.hash = hashDefault || "#/";
		}
	},
	on( arr, fn ) {
		const cb = this._callbacks.find( cb => this._arrayEq( cb[ 0 ], arr ) );

		if ( cb ) {
			cb[ 1 ].push( fn );
		} else {
			this._callbacks.push( [ arr.slice(), [ fn ] ] );
		}
	},

	// private:
	_onhashchange() {
		const hash = this._parseHash( location.hash );

		this._callbacks.forEach( cb => {
			if ( cb[ 0 ].every( ( s, i ) => s === hash[ i ] ) ) {
				cb[ 1 ].forEach( fn => fn( hash, this._previousHash ) );
			}
		} );
		this._previousHash = hash;
	},
	_arrayEq( a, b ) {
		return a.length === b.length
			? a.every( ( an, i ) => an === b[ i ] )
			: false;
	},
	_parseHash( h ) {
		return h.substr( 2 ).split( "/" );
	},
};
