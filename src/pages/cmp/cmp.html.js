"use strict";

GSUsetTemplate( "gs-cmpPage", () =>
	GSUcreateDiv( { class: "page", id: "cmpPage" },
		GSUcreateElement( "gsui-com-player", { id: "cmpPageCmp" } ),
		GSUcreateElement( "gscom-userlink", { id: "cmpPageUserLink" } ),
	),
);
