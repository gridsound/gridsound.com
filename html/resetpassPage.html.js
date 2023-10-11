"use strict";

GSUsetTemplate( "gs-resetpassPage", () =>
	GSUcreateDiv( { class: "page", id: "resetpassPage" },
		GSUcreateElement( "form", { class: "form", id: "resetpassForm" },
			GSUcreateDiv( { class: "form-title" }, "Reset password" ),
			GSUcreateDiv( { class: "form-intro" },
				GSUcreateDiv( null, "Set a new password." ),
				GSUcreateDiv( null, "Your password has been changed successfully." ),
			),
			GSUcreateLabel( { class: "field" },
				GSUcreateSpan( { class: "field-label" }, "New password" ),
				GSUcreateInput( { class: "field-input", id: "resetpassFormPass", type: "password", name: "pass", required: true } ),
			),
			GSUcreateLabel( { class: "field" },
				GSUcreateSpan( { class: "field-label" }, "New password (confirmation)" ),
				GSUcreateInput( { class: "field-input", id: "resetpassFormPass2", type: "password", name: "pass2", required: true } ),
			),
			GSUcreateDiv( { class: "form-error", id: "resetpassFormError" } ),
			GSUcreateDiv( { class: "form-btns" },
				GSUcreateA( { class: "btn", href: "#/auth" },
					GSUcreateSpan( { class: "btn-text" }, "Back to the login page" ),
				),
				GSUcreateButton( { class: "btn btn-submit", id: "resetpassFormSubmit", type: "submit" },
					GSUcreateSpan( { class: "btn-text" }, "Save" ),
				),
			),
		),
	),
);
