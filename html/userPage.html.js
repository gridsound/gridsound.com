"use strict";

GSUsetTemplate( "gs-userPage", () =>
	GSUcreateDiv( { class: "page", id: "userPage" },
		GSUcreateDiv( { id: "userPageUser" },
			GSUcreateDiv( { id: "userPageUserAvatar", class: "userAvatar" },
				GSUcreateElement( "img", { id: "userPageUserAvatarImg", class: "userAvatarImg" } ),
				GSUcreateI( { class: "userAvatarDef gsuiIcon", "data-icon": "musician" } ),
			),
			GSUcreateDiv( { id: "userPageUserInfo" },
				GSUcreateDiv( { id: "userPageUserUsername" } ),
				GSUcreateDiv( { id: "userPageUserFirstname" } ),
				GSUcreateDiv( { id: "userPageUserLastname" } ),
			),
			GSUcreateDiv( { id: "userPageUserEmail" },
				GSUcreateSpan( { id: "userPageUserEmailAddr" },
					GSUcreateI( { id: "userPageUserEmailAddrStatus", class: "gsuiIcon" } ),
					GSUcreateSpan( { id: "userPageUserEmailAddrText" } ),
				),
				GSUcreateA( { id: "userPageUserEmailNot" },
					GSUcreateI( { id: "userPageUserEmailSending", class: "gsuiIcon" } ),
					GSUcreateSpan( { id: "userPageUserEmailToSend" }, "resend the confirmation email" ),
					GSUcreateSpan( { id: "userPageUserEmailSent" }, "email sent" ),
				),
			),
			GSUcreateA( { id: "userPageUserEdit", class: "gsuiIcon", "data-icon": "pen" } ),
		),
		GSUcreateElement( "form", { id: "userPageUserForm", class: "pageSection hidden" },
			GSUcreateDiv( { class: "pageSectionTitle" },
				GSUcreateSpan( { class: "pageSectionTitleLabel" }, "Profile edition" ),
			),
			GSUcreateDiv( { class: "pageSectionBody" },
				GSUcreateLabel( { class: "field" },
					GSUcreateSpan( { class: "field-label" }, "avatar" ),
					GSUcreateDiv( null,
						GSUcreateSpan( null, "GridSound accepts, for the moment, only " ),
						GSUcreateAExt( { class: "highlight", href: "https://gravatar.com" },
							GSUcreateI( { class: "gsuiIcon gsuiIconB", "data-icon": "wordpress" } ),
							GSUcreateSpan( null, "WordPress - Gravatar" ),
						),
						GSUcreateSpan( null, " as avatar." ),
					),
				),
				GSUcreateLabel( { class: "field" },
					GSUcreateSpan( { class: "field-label" }, "first name" ),
					GSUcreateInput( { class: "field-input", type: "text", name: "firstname", spellcheck: "false" } ),
				),
				GSUcreateLabel( { class: "field" },
					GSUcreateSpan( { class: "field-label" }, "last name" ),
					GSUcreateInput( { class: "field-input", type: "text", name: "lastname", spellcheck: "false" } ),
				),
				GSUcreateLabel( { class: "field" },
					GSUcreateSpan( { class: "field-label" }, "email" ),
					GSUcreateInput( { class: "field-input", type: "email", name: "email", spellcheck: "false" } ),
					GSUcreateSpan( null, "if the email is changed, a confirmation email has to be sent again" ),
				),
				GSUcreateLabel( { class: "field field-inline" },
					GSUcreateSpan( { class: "field-label" }, "email public" ),
					GSUcreateDiv( null,
						GSUcreateInput( { class: "field-input", type: "checkbox", name: "emailpublic" } ),
						GSUcreateSpan( null, "if checked, your email will be public on your profile" ),
					),
				),
				GSUcreateDiv( { id: "userPageUserFormError" } ),
				GSUcreateDiv( { id: "userPageUserFormBtns" },
					GSUcreateA( { id: "userPageUserFormCancel", class: "btn" },
						GSUcreateSpan( { class: "btn-text" }, "cancel" ),
					),
					GSUcreateButton( { id: "userPageUserFormSubmit", class: "btn btn-submit", type: "submit" },
						GSUcreateSpan( { class: "btn-text" }, "save" ),
					),
				),
			),
		),
		GSUcreateDiv( { class: "pageSection" },
			GSUcreateDiv( { class: "pageSectionTitle" },
				GSUcreateA( { class: "userPageMenuLink", href: false, id: "userPageNbCompositions" },
					GSUcreateSpan( { class: "pageSectionTitleValue" } ),
					GSUcreateSpan( { class: "pageSectionTitleLabel" }, "composition·s" ),
				),
				GSUcreateA( { class: "userPageMenuLink", href: false, id: "userPageNbCompositionsDeleted" },
					GSUcreateSpan( { class: "pageSectionTitleValue" }, 0 ),
					GSUcreateSpan( { class: "pageSectionTitleLabel" }, "in the bin" ),
				),
			),
			GSUcreateDiv( { class: "pageSectionBody", id: "userPageCmps" } ),
			GSUcreateDiv( { class: "pageSectionPlaceHolder", id: "userPageCmpsPlaceholder" },
				GSUcreateSpan( { class: "pageSectionPlaceHolder-text" },
					GSUcreateSpan( null, "No saved composition yet" ),
					GSUcreateSpan( null, ", you should create a new one right now!" ),
				),
				GSUcreateDiv( { class: "pageSectionPlaceHolder-draw" },
					GSUcreateI( { class: "gsuiIcon", "data-icon": "music" } ),
				),
			),
			GSUcreateDiv( { class: "pageSectionPlaceHolder", id: "userPageCmpsDeletedPlaceholder" },
				GSUcreateSpan( { class: "pageSectionPlaceHolder-text" }, "There is no composition inside your bin." ),
				GSUcreateDiv( { class: "pageSectionPlaceHolder-draw" },
					GSUcreateI( { class: "gsuiIcon", "data-icon": "trash" } ),
				),
			),
		),
	),
);