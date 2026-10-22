"use strict";

$.$setTemplate( "gscoSamples", () =>
	$.$div( { class: "page", id: "samplesPage" },
		$.$flex( { id: "samplesPageHead", x: true, ycenter: true, g8: true },
			$.$span( { id: "samplesPageStorage" } ),
			$.$elem( "gsui-buttons", null,
				$.$elem( "gsui-button", { "data-prop": "open-groups", icon: "chevrons-down", "data-tooltip": GSTX.$samplesOpenGroups } ),
				$.$elem( "gsui-button", { "data-prop": "close-groups", icon: "chevrons-up", "data-tooltip": GSTX.$samplesCloseGroups } ),
			),
			$.$elem( "gsui-button", { "data-prop": "refresh", id: "samplesPageRefresh", icon: "sync", "data-tooltip": GSTX.$samplesRefresh } ),
			$.$elem( "gsui-button", { "data-prop": "new-group", id: "samplesPageNewGrp", model: "submit", icon: "cu-folder-music-plus", "data-tooltip": GSTX.$samplesNewGroup } ),
		),
		$.$elem( "gsco-loader" ),
		$.$div( { id: "samplesPageGroups" } ),
		$.$div( { class: "page-ph", id: "samplesPagePH" },
			$.$span( null, GSTX.$yourSamplesPH ),
			$.$icon( { icon: "folder-music" } ),
		),
	),
);
