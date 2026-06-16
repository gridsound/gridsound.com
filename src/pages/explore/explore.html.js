"use strict";

$.$setTemplate( "gscoExplore", () =>
	$.$div( { class: "page", id: "explorePage" },
		$.$div( { id: "exploreSwitch" },
			$.$link( { href: "#/explore/all" }, GSTX.$all ),
			$.$link( { href: "#/explore" }, GSTX.$following ),
		),
		$.$div( { id: "exploreIntro" } ),
		$.$div( { id: "exploreBody" } ),
	),
);
