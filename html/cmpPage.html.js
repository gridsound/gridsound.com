"use strict";

GSUsetTemplate( "gs-cmpPage", () =>
	GSUcreateDiv( { class: "page", id: "cmpPage" },
		GSUcreateElement( "gsui-cmp-player", { id: "cmpPageCmp" } ),
		GSUcreateA( { id: "cmpPageAuthor" },
			GSUcreateI( { class: "gsuiIcon", "data-icon": "musician" } ),
			GSUcreateDiv( { id: "cmpPageAuthorAvatar" } ),
			GSUcreateSpan( { id: "cmpPageAuthorUsername" } ),
			GSUcreateSpan( { id: "cmpPageAuthorName" } ),
		),
	),
);
