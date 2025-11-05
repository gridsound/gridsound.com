"use strict";

GSUsetTemplate( "gs-userPage", () =>
	GSUcreateDiv( { class: "page", id: "userPage" },
		GSUcreateElement( "gsui-com-profile", { id: "userPageProfile" } ),
		GSUcreateDiv( { id: "userPageProfileMenu" },
			GSUcreateButton( { class: "userPageProfileMenu-btn", "data-action": "compositions" },
				GSUcreateSpan( { inert: true, id: "userPageProfileNbCmps" } ),
				GSUcreateSpan( { inert: true }, "composition·s" ),
			),
			GSUcreateButton( { class: "userPageProfileMenu-btn", "data-action": "compositions-bin" },
				GSUcreateSpan( { inert: true, id: "userPageProfileNbCmpsDeleted" } ),
				GSUcreateSpan( { inert: true }, "in the bin" ),
			),
		),
		GSUcreateElement( "gsui-com-playlist", { id: "userPagePlaylist" } ),
	),
);
