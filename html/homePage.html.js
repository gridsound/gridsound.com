"use strict";

GSUsetTemplate( "gs-homePage", () =>
	GSUcreateDiv( { class: "page", id: "homePage" },
		GSUcreateDiv( { id: "homeIntro" },
			GSUcreateElement( "img", { id: "homeLogo", src: "../assets/icon/white/192.png" } ),
			GSUcreateSpan( null,
				GSUcreateSpan( null, "Hi ! " ),
				GSUcreateI( { class: "gsuiIcon", "data-icon": "smiley" } ),
				GSUcreateSpan( null, " thanks for your interest in " ),
				GSUcreateElement( "b", null, "GridSound" ),
				GSUcreateSpan( null, ", a work-in-progress online digital audio workstation. Keep in mind the website and the application are still in development, you could face several bugs " ),
				GSUcreateI( { class: "gsuiIcon", "data-icon": "bug" } ),
				GSUcreateSpan( null, ". The " ),
				GSUcreateAExt( { class: "highlight", href: "https://github.com/gridsound/daw/wiki/help" }, "help section" ),
				GSUcreateSpan( null, " describe how to use the app and also shows what is possible. Then, the " ),
				GSUcreateAExt( { class: "highlight", href: "https://github.com/gridsound/daw/wiki/changelog" }, "changelog" ),
				GSUcreateSpan( null, " is another important link, it describe what's news between each new version." ),
			),
		),
		GSUcreateA( { id: "homeDAWLink", href: "https://gridsound.com/daw/" },
			GSUcreateElement( "img", { id: "homeDAWLinkImg", src: "../assets/screenshots/daw.jpg" } ),
			GSUcreateDiv( { id: "homeDAWLinkText" },
				GSUcreateSpan( { id: "homeDAWLinkTitle" },
					GSUcreateSpan( { id: "homeDAWLinkGS" }, "GridSound" ),
					GSUcreateSpan( null, " : DAW" ),
				),
				GSUcreateSpan( null, "Click here to launch the app" ),
				GSUcreateElement( "small", null, "(no account needed)" ),
			),
		),
	),
);
