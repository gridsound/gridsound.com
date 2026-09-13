"use strict";

$.$setTemplate( "gscoSamples", () =>
	$.$div( { class: "page", id: "samplesPage" },
		$.$flex( { id: "samplesPageHead", x: true, ycenter: true, g8: true },
			$.$span( { id: "samplesPageStorage" } ),
			$.$elem( "gsui-com-button", { "data-prop": "open-groups", type: "button", icon: "chevrons-down", "data-tooltip": GSTX.$samplesOpenGroups } ),
			$.$elem( "gsui-com-button", { "data-prop": "close-groups", type: "button", icon: "chevrons-up", "data-tooltip": GSTX.$samplesCloseGroups } ),
			$.$elem( "gsui-com-button", { "data-prop": "new-group", type: "submit", icon: "cu-folder-music-plus", "data-tooltip": GSTX.$samplesNewGroup } ),
		),
		$.$div( { id: "samplesPageGroups" } ),
		$.$div( { class: "page-ph", id: "samplesPagePH" },
			$.$span( null, GSTX.$yourSamplesPH ),
			$.$icon( { icon: "folder-music" } ),
		),
	),
);
