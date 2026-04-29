"use strict";

$.$setTemplate( "gscoForgotPass", () =>
	$.$div( { class: "page", id: "forgotpassPage" },
		$.$elem( "form", { class: "form", id: "forgotpassForm" },
			$.$div( { class: "form-title" }, "Password forgotten" ),
			$.$div( { class: "form-intro" },
				$.$div( null, "Enter your email address, you will receive a link to reset your password." ),
				$.$div( null, "An email has been sent to your email address, click on the link in it to continue your password reset. You can close this tab." ),
			),
			$.$label( { class: "field" },
				$.$span( { class: "field-label" }, "Email" ),
				$.$input( { class: "field-input", id: "forgotpassFormEmail", type: "email", name: "email", required: true } ),
			),
			$.$div( { class: "form-error", id: "forgotpassFormError" } ),
			$.$div( { class: "form-btns" },
				$.$elem( "gsui-com-button", { href: "#/auth", text: "Back" } ),
				$.$elem( "gsui-com-button", { type: "submit", text: "Send email", id: "forgotpassFormSubmit" } ),
			),
		),
	),
);
