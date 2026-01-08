"use strict";

GSUsetTemplate( "gscoExplore", () =>
	GSUcreateDiv( { class: "page", id: "explorePage" },
		GSUcreateDiv( { id: "exploreSwitch" },
			GSUcreateA( { href: "#/explore/all" }, "All" ),
			GSUcreateA( { href: "#/explore" }, "You" ),
		),
		GSUcreateDiv( { id: "exploreBody" },
			"plop"
		),
	),
);
