"use strict";

class logsPage {
	constructor() {
		Object.seal( this );
	}

	show() {
		gsapiClient.$getLogs().then( obj => {
			this.#displayLogs( obj.logs );
			this.#displayConnectedUsers( DOM.logsPage_users5min, obj.users5min );
			this.#displayConnectedUsers( DOM.logsPage_users24h, obj.users24h );
		} );
	}

	// .........................................................................
	#displayConnectedUsers( elList, users ) {
		GSUforEach( GSUdomQSA( elList, "a" ), el => el.remove() );
		elList.append( ...users.map( u => {
			return GSUcreateA( { href: `#/u/${ u }` }, u );
		} ) );
	}
	#displayLogs( logs ) {
		let dateSave = null;

		GSUdomEmpty( DOM.logsPage_logs );
		DOM.logsPage_logs.append( ...logs.map( r => {
			const [ date, time ] = r.created.split( " " );

			r.icon = logsPage.#icons[ r.action ];
			r.time = time;
			if ( dateSave !== date ) {
				dateSave = date;
				return [
					GSUcreateDiv( { class: "logsPage-date" },
						GSUcreateSpan( null, date ),
					),
					GSUgetTemplate( "gs-logsPage-log", r ),
				];
			}
			return [ GSUgetTemplate( "gs-logsPage-log", r ) ];
		} ).flat() );
	}
	static #icons = {
		OPEN: "eye",
		VISIBLE: "eye",
		PRIVATE: "eye",
		"SAVE-CMP": "music",
		RENDER: "render",
		DELETE: "trash",
		RESTORE: "trash-restore",
		UPDATE: "pen",
		LOGIN: "login",
		"LOGIN-FAIL": "login",
		LOGOUT: "logout",
		FOLLOW: "follow",
		UNFOLLOW: "unfollow",
		LIKE: "heart",
		UNLIKE: "heart-slash",
		"SEARCH-U": "cu-search-user",
		"SEARCH-CMP": "cu-search-music",
		"GET-FOLLOWERS": "list",
		"GET-FOLLOWING": "list",
		"GET-MUSICS": "musics",
		"GET-MUSIC": "music",
		"GET-USER": "musician",
		"RESEND-EMAIL": "at",
	};
}
