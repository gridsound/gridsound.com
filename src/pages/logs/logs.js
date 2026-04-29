"use strict";

class gscoLogs {
	constructor() {
		Object.seal( this );
	}

	// .........................................................................
	$show() {
		gsapiClient.$getLogs().then( obj => {
			this.#displayLogs( obj.logs );
			this.#displayConnectedUsers( DOM.logsPage_users5min, obj.users5min );
			this.#displayConnectedUsers( DOM.logsPage_users24h, obj.users24h );
		} );
	}

	// .........................................................................
	#displayConnectedUsers( elList, users ) {
		elList.$query( "a" ).$remove();
		elList.$append( ...users.map( u => {
			return $.$link( { href: `#/u/${ u }` }, u );
		} ) );
	}
	#displayLogs( logs ) {
		let dateSave = null;

		DOM.logsPage_logs.$empty().$append( ...logs.map( r => {
			const [ date, time ] = r.created.split( " " );

			r.icon = gscoLogs.#icons[ r.action ];
			r.time = time;
			if ( dateSave !== date ) {
				dateSave = date;
				return [
					$.$div( { class: "logsPage-date" },
						$.$span( null, date ),
					),
					GSUgetTemplate( "gscoLogsLog", r ),
				];
			}
			return [ GSUgetTemplate( "gscoLogsLog", r ) ];
		} ).flat() );
	}
	static #icons = {
		OPEN: "eye",
		VISIBLE: "eye",
		PRIVATE: "eye",
		"SAVE-CMP": "music",
		RENDER: "render",
		DELETE: "trash",
		RESTORE: "untrash",
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
