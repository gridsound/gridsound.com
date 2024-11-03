"use strict";

GSUsetTemplate( "gs-userPage", () =>
	GSUcreateDiv( { class: "page", id: "userPage" },
		GSUcreateElement( "gsui-com-profile", { id: "userPageProfile" } ),
		GSUcreateElement( "gsui-com-playlist", { id: "userPagePlaylist" } ),
	),
);
