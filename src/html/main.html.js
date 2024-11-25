"use strict";

GSUsetTemplate( "gs-main", () =>
	GSUcreateDiv( { id: "main", class: "noauth" },
		GSUcreateDiv( { id: "head" },
			GSUcreateA( { id: "headIcon", class: "headLink", href: "#/" } ),
			GSUcreateAExt( { id: "headNewCmp", class: "headLink", href: DAWURL, title: "Create a new composition" },
				GSUcreateI( { class: "gsuiIcon", "data-icon": "music" } ),
				GSUcreateI( { class: "gsuiIcon", "data-icon": "plus" } ),
				GSUcreateI( { class: "gsuiIcon", "data-icon": "plus" } ),
			),
			GSUcreateA( { id: "headUser", class: "headLink" },
				GSUcreateDiv( { id: "headUsername" } ),
				GSUcreateElement( "gsui-com-avatar", { id: "headAvatar" } ),
			),
			GSUcreateA( { id: "headAuth", class: "headLink gsuiIcon", href: "#/auth", "data-icon": "login", "data-spin": "on", title: "Authentication" } ),
		),
		GSUcreateDiv( { id: "pages" },
			GSUcreateDiv( { id: "loader" },
				GSUcreateI( { class: "gsuiIcon", "data-spin": "on" } ),
			),
			GSUcreateDiv( { id: "error" },
				GSUcreateSpan( { id: "errorLabel" }, "error" ),
				GSUcreateSpan( { id: "errorCode" } ),
			),
		),
		GSUcreateDiv( { id: "footer" },
			GSUcreateDiv( { id: "footerSocialsLink" },
				GSUcreateAExt( { class: "gsuiIcon gsuiIconB", "data-icon": "github", href: "//github.com/gridsound" } ),
				GSUcreateAExt( { class: "gsuiIcon gsuiIconB", "data-icon": "codepen", href: "//codepen.io/gridsound" } ),
				GSUcreateAExt( { class: "gsuiIcon gsuiIconB", "data-icon": "discord", href: "//discord.gg/NUYxHAg" } ),
				GSUcreateAExt( { class: "gsuiIcon gsuiIconB", "data-icon": "twitter", href: "//twitter.com/gridsound" } ),
				GSUcreateAExt( { class: "gsuiIcon gsuiIconB", "data-icon": "youtube", href: "//youtube.com/@gridsound" } ),
				GSUcreateAExt( { class: "gsuiIcon gsuiIconB", "data-icon": "facebook", href: "//facebook.com/gridsound" } ),
			),
			GSUcreateDiv( { id: "footerCopyright" }, `© ${ ( new Date() ).getFullYear() } gridsound.com all rights reserved` ),
		),
	),
);
