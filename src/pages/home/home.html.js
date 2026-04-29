"use strict";

$.$setTemplate( "gscoHome", () =>
	$.$div( { class: "page", id: "homePage" },
		$.$elem( "h1", { id: "homePage-title" }, "Start creating your own music online" ),
		$.$div( { id: "homePage-logo", inert: true } ),
		$.$div( { id: "homePage-anim", inert: true },
			$.$div( { id: "homePage-anim-lights" },
				GSUnewArray( 5, () => $.$div( { class: "homePage-anim-light" } ) ),
			),
			$.$div( { id: "homePage-anim-white-spot" } ),
			$.$div( { id: "homePage-anim-stars" },
				GSUnewArray( 17, () => $.$div() ),
			),
			$.$div( { id: "homePage-anim-icons" },
				[ "cu-waveform", "piano", "drum", "amp-guitar", "mixer", "music", "sax-hot" ].map( i =>
					$.$icon( { icon: i } ) )
			),
		),
		$.$div( { id: "homePage-screen" },
			$.$link( { href: gscoDAWURL },
				$.$elem( "img", { src: "assets/screenshots/daw-1.47.0-small.jpg" } ),
			),
			$.$div( { id: "homePage-screen-blur" } ),
			$.$div( { id: "homePage-screen-brd" } ),
		),
		$.$flex( { id: "homePage-trySynth", x: true, xcenter: true, ycenter: true, g16: true },
			$.$div(),
			$.$elem( "gsui-joystick", { id: "homePage-trySynth-joystick" } ),
		),
	),
);
