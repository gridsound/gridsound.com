"use strict";

const apiClient = {
	url: "https://api.gridsound.com/",
	me: {},
	init() {
		this.headers = Object.freeze( {
			"Content-Type": "application/json; charset=utf-8",
		} );
	},
	isLogged() {
		return this._fetch( "GET", "getMe" )
			.then( this._loginThen.bind( this ) )
			.then( res => res.ok, () => false );
	},
	login( email, pass ) {
		return this._fetch( "POST", "login", { email, pass } )
			.then( this._loginThen.bind( this ) );
	},
	signup( username, email, pass ) {
		return this._fetch( "POST", "createUser", { username, email, pass } )
			.then( this._loginThen.bind( this ) );
	},
	logout() {
		return this._fetch( "POST", "logout", { confirm: true } )
			.then( res => {
				if ( res.ok ) {
					Object.keys( this.me ).forEach( k => delete this.me[ k ] );
				}
				return res;
			} );
	},
	getMyCompositions() {
		return this._fetch( "GET", "getMyCompositions" );
	},
	getUserCompositions( id ) {
		return this._fetch( "GET", `getUserCompositions?id=${ id }` );
	},

	// private:
	_fetch( method, url, body ) {
		const obj = {
			method,
			headers: this.headers,
			credentials: "include",
		};

		if ( body ) {
			obj.body = JSON.stringify( body );
		}
		return fetch( this.url + url, obj ).then( res => res.json() );
	},
	_loginThen( res ) {
		if ( res.ok ) {
			Object.assign( this.me, res.data );
			return res;
		} else {
			const msg = this.errorCode[ res.msg ];

			if ( msg ) {
				res.msg = msg;
			}
			throw( res );
		}
	},
	errorCode: {
		"login:fail": "The email/password don't match",
		"pass:too-short": "The password is too short",
		"email:too-long": "The email is too long",
		"email:duplicate": "This email is already used",
		"email:bad-format": "The email is not correct",
		"username:too-long": "The username is too long",
		"username:too-short": "The username is too short",
		"username:duplicate": "This username is already taken",
		"username:bad-format": "The username can only contains letters, digits and _",
	},
};
