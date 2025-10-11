"use strict";

GSUsetTemplate( "gs-homePage", () =>
	GSUcreateDiv( { class: "page", id: "homePage" },
		GSUcreateElement( "h1", { id: "homePage-title" }, "Start creating your own music online" ),
		GSUcreateDiv( { id: "homePage-logo", inert: true } ),
		GSUcreateDiv( { id: "homePage-anim", inert: true },
			GSUnewArray( 5, () => GSUcreateDiv( { class: "homePage-anim-light" } ) ),
			GSUcreateDiv( { id: "homePage-anim-white-spot" } ),
			GSUcreateDiv( { id: "homePage-anim-stars" },
				GSUnewArray( 17, () => GSUcreateDiv( { class: "homePage-anim-star" } ) ),
			),
			GSUcreateDiv( { id: "homePage-anim-icons" },
				[ "cu-waveform", "piano", "drum", "amp-guitar", "mixer", "music", "sax-hot" ].map( i =>
					GSUcreateIcon( { class: "homePage-anim-icon", icon: i } ) )
			),
		),
		GSUcreateDiv( { id: "homePage-screen" },
			GSUcreateA( { href: DAWURL },
				GSUcreateElement( "img", { src: "assets/screenshots/daw-1.47.0-small.jpg" } ),
			),
			GSUcreateDiv( { id: "homePage-screen-blur" } ),
			GSUcreateDiv( { id: "homePage-screen-brd" } ),
		),
		GSUcreateFlex( { id: "homePage-trySynth", x: true, xcenter: true, ycenter: true, g16: true },
			GSUcreateDiv( { id: "homePage-trySynth-tryme" } ),
			GSUcreateElement( "gsui-joystick", { id: "homePage-trySynth-joystick" } ),
		),
	),
);
