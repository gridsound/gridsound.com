"use strict";

GSUsetTemplate( "gs-authPage", () =>
	GSUcreateDiv( { class: "page", id: "authPage" },
		GSUcreateElement( "form", { class: "form", id: "authPageSignup" },
			GSUcreateDiv( { class: "form-title" }, "Create a personal account" ),
			GSUcreateLabel( { class: "field" },
				GSUcreateSpan( { class: "field-label" }, "Email" ),
				GSUcreateInput( { class: "field-input", id: "authPageSignupEmail", type: "email", name: "email", required: true, maxlength: 128, placeholder: "eg: janedoe@example.com" } ),
			),
			GSUcreateLabel( { class: "field" },
				GSUcreateSpan( { class: "field-label" }, "Username" ),
				GSUcreateInput( { class: "field-input", id: "authPageSignupUsername", type: "text", name: "username", required: true, minlength: 4, maxlength: 32, pattern: "[a-zA-Z0-9_]*" } ),
			),
			GSUcreateLabel( { class: "field" },
				GSUcreateSpan( { class: "field-label" }, "Password" ),
				GSUcreateInput( { class: "field-input", id: "authPageSignupPass", type: "password", name: "pass", required: true, minlength: 6 } ),
			),
			GSUcreateDiv( { class: "form-error", id: "authPageSignupError" } ),
			GSUcreateDiv( { class: "form-btns" },
				GSUcreateElement( "gsui-com-button", { id: "authPageSignupBtn", type: "submit", text: "Sign up" } ),
			),
		),
		GSUcreateElement( "form", { class: "form", id: "authPageLogin" },
			GSUcreateDiv( { class: "form-title" }, "Log in to GridSound" ),
			GSUcreateLabel( { class: "field" },
				GSUcreateSpan( { class: "field-label" }, "Email (or username)" ),
				GSUcreateInput( { class: "field-input", id: "authPageLoginEmail", type: "text", name: "email", required: true } ),
			),
			GSUcreateLabel( { class: "field" },
				GSUcreateSpan( { class: "field-label" }, "Password" ),
				GSUcreateInput( { class: "field-input", id: "authPageLoginPass", type: "password", name: "pass", required: true } ),
			),
			GSUcreateDiv( { id: "authPageLoginForgot" },
				GSUcreateA( { href: "#/forgotPassword" }, "Forgot password ?" ),
			),
			GSUcreateDiv( { class: "form-error", id: "authPageLoginError" } ),
			GSUcreateDiv( { class: "form-btns" },
				GSUcreateElement( "gsui-com-button", { id: "authPageLoginBtn", type: "submit", text: "Log in" } ),
			),
		),
	),
);
