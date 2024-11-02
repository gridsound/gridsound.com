"use strict";

GSUsetTemplate( "gs-homePage", () =>
	GSUcreateDiv( { class: "page", id: "homePage" },
		GSUcreateSpan( null,
			GSUcreateElement( "img", { src: "../assets/icon/white/192.png" } ),
			GSUcreateSpan( null,
				"Welcome to GridSound, the platform where you can create your own music. " +
				"Start by creating a new profile by clicking the login button on the top right. " +
				"You can test the webapp before doing an account."
			),
		),
		GSUcreateElement( "ul", null,
			GSUcreateElement( "li", null,
				GSUcreateAExt( { href: DAWURL }, "DAW (Digital Audio Workstation)" ),
				GSUcreateElement( "br", null ),
				GSUcreateSpan( null,
					"This is the main app to create a full digital music, " +
					"keep in mind it's still in development, you could face several bugs. " +
					"Here is the "
				),
				GSUcreateAExt( { class: "highlight", href: "//github.com/gridsound/daw/wiki/changelog" }, "changelog" ),
				GSUcreateSpan( null, ", there is also a (too small) " ),
				GSUcreateAExt( { class: "highlight", href: "//github.com/gridsound/daw/wiki/help" }, "help section" ),
				GSUcreateSpan( null, "." ),
			),
			GSUcreateElement( "li", null,
				GSUcreateAExt( { href: "//soundbox.gridsound.com" }, "SoundBox" ),
				GSUcreateElement( "br", null ),
				GSUcreateSpan( null,
					"A simple page to quickly check an entire audio sample library in few clicks. " +
					"Just drop your files and you can check their waveforms and play them as you want, " +
					"easier than VLC or anything for this specific purpose."
				),
			),
			GSUcreateElement( "li", null,
				GSUcreateAExt( { href: "//piano.gridsound.com" }, "Piano" ),
				GSUcreateElement( "br", null ),
				GSUcreateSpan( null,
					"A cute little virtual piano (mobile compatible). " +
					"Each key has its own sample recorded from a real piano (Steinway & Sons model B)."
				),
			),
			GSUcreateElement( "li", null,
				GSUcreateAExt( { href: "//gammes.gridsound.com" }, "Gammes" ),
				GSUcreateElement( "br", null ),
				GSUcreateSpan( null,
					"Gammes is an educative page to learn and listen the musical scales with different notations."
				),
			),
		),
		GSUcreateSpan( null,
			"In the footer you have access to all the GridSound links on different social networks. " +
			"You can come to the Discord and join the chat to ask for help on how to use the DAW " +
			"or you can follow us on Twitter or Facebook to read our latest news. " +
			"The GitHub link allows you to open an issue if you see a bug."
		),
	),
);
