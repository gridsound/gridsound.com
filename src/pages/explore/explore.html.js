"use strict";

$.$setTemplate( "gscoExplore", () =>
	$.$div( { class: "page", id: "explorePage" },
		$.$div( { id: "exploreSwitch" },
			$.$link( { href: "#/explore/all" }, "All" ),
			$.$link( { href: "#/explore" }, "You" ),
		),
		$.$div( { id: "exploreBody" },
			"plop"
		),
	),
);
