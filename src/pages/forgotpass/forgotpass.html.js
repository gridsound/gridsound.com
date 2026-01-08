"use strict";

GSUsetTemplate( "gscoForgotPass", () =>
	GSUcreateDiv( { class: "page", id: "forgotpassPage" },
		GSUcreateElement( "form", { class: "form", id: "forgotpassForm" },
			GSUcreateDiv( { class: "form-title" }, "Password forgotten" ),
			GSUcreateDiv( { class: "form-intro" },
				GSUcreateDiv( null, "Enter your email address, you will receive a link to reset your password." ),
				GSUcreateDiv( null, "An email has been sent to your email address, click on the link in it to continue your password reset. You can close this tab." ),
			),
			GSUcreateLabel( { class: "field" },
				GSUcreateSpan( { class: "field-label" }, "Email" ),
				GSUcreateInput( { class: "field-input", id: "forgotpassFormEmail", type: "email", name: "email", required: true } ),
			),
			GSUcreateDiv( { class: "form-error", id: "forgotpassFormError" } ),
			GSUcreateDiv( { class: "form-btns" },
				GSUcreateElement( "gsui-com-button", { href: "#/auth", text: "Back" } ),
				GSUcreateElement( "gsui-com-button", { type: "submit", text: "Send email", id: "forgotpassFormSubmit" } ),
			),
		),
	),
);
