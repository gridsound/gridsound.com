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
			.then( res => this._assignMe( res ) )
			.then( res => res.ok, () => false );
	},
	login( email, pass ) {
		return this._fetch( "POST", "login", { email, pass } )
			.then( res => this._assignMe( res ) );
	},
	signup( username, email, pass ) {
		return this._fetch( "POST", "createUser", { username, email, pass } )
			.then( res => this._assignMe( res ) );
	},
	resendConfirmationEmail() {
		return this._fetch( "POST", "resendConfirmationEmail", { email: this.me.email } );
	},
	logout() {
		return this._fetch( "POST", "logout", { confirm: true } )
			.then( res => this._deleteMe( res ) );
	},
	getMyCompositions() {
		return this._fetch( "GET", "getMyCompositions" );
	},
	getUser( username ) {
		return this._fetch( "GET", `getUser?username=${ username }` )
			.then( res => res.data );
	},
	getUserCompositions( id ) {
		return this._fetch( "GET", `getUserCompositions?id=${ id }` );
	},

	// private:
	_assignMe( res ) {
		Object.assign( this.me, res.data );
		this.me.usernameLow = this.me.username.toLowerCase();
		return res;
	},
	_deleteMe( res ) {
		Object.keys( this.me ).forEach( k => delete this.me[ k ] );
		return res;
	},
	_fetch( method, url, body ) {
		const obj = {
			method,
			headers: this.headers,
			credentials: "include",
		};

		if ( body ) {
			obj.body = JSON.stringify( body );
		}
		return fetch( this.url + url, obj )
			.then( res => res.json() )
			.then( res => this._fetchThen( res ) );
	},
	_fetchThen( res ) {
		if ( res.ok ) {
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
