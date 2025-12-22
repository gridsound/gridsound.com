"use strict";

GSUsetTemplate( "gs-userPage", () =>
	GSUcreateDiv( { class: "page", id: "userPage" },
		GSUcreateElement( "gsui-com-profile", { id: "userPageProfile" } ),
		GSUcreateDiv( { id: "userPageProfileMenu" },
			GSUcreateA( { class: "userPageProfileMenu-btn", "data-action": "cmps" },
				GSUcreateSpan( { inert: true, id: "userPageProfileNbCmps" } ),
				GSUcreateSpan( { inert: true }, "composition·s" ),
			),
			GSUcreateA( { class: "userPageProfileMenu-btn", "data-action": "cmpsDeleted" },
				GSUcreateSpan( { inert: true, id: "userPageProfileNbCmpsDeleted" } ),
				GSUcreateSpan( { inert: true }, "in the bin" ),
			),
			GSUcreateA( { class: "userPageProfileMenu-btn", "data-action": "cmpsLiked" },
				GSUcreateSpan( { inert: true, id: "userPageProfileNbCmpsLiked" } ),
				GSUcreateSpan( { inert: true }, "like·s" ),
			),
		),
		GSUcreateDiv( { id: "userPagePlaylist" } ),
	),
);
