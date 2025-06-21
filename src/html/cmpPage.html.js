"use strict";

GSUsetTemplate( "gs-cmpPage", () =>
	GSUcreateDiv( { class: "page", id: "cmpPage" },
		GSUcreateElement( "gsui-com-player", { id: "cmpPageCmp" } ),
		GSUcreateA( { id: "cmpPageAuthor" },
			GSUcreateIcon( { icon: "musician" } ),
			GSUcreateDiv( { id: "cmpPageAuthorAvatar" } ),
			GSUcreateSpan( { id: "cmpPageAuthorUsername" } ),
			GSUcreateSpan( { id: "cmpPageAuthorName" } ),
		),
	),
);
