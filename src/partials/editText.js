"use strict";

class gscoPartialEditText {
	static $createForm( o ) {
		const dom = $( $.$flex( { class: "editText", y: true, g16: true },
			$.$div( { class: "editText-text", "data-placeholder": o.$placeholder } ),
			$.$elem( "textarea", { class: "editText-textarea" } ),
			$.$flex( { x: true, xcenter: true, g16: true },
				$.$elem( "gsui-button", { action: "edit", text: o.$edit } ),
				$.$elem( "gsui-button", { action: "cancel", text: o.$cancel } ),
				$.$elem( "gsui-button", { action: "save", text: o.$save, type: "submit", model: "submit" } ),
			),
		) );

		dom.$query( "gs-flex" ).$onclick( e => {
			switch ( $.$getAttr( e.target, "action" ) ) {
				case "edit":
					dom.$addAttr( "data-editing" );
					dom.$query( "textarea" ).$value( dom.$query( ".editText-text" ).$text() ).$focus();
					break;
				case "cancel":
					dom.$rmAttr( "data-editing" );
					dom.$query( "textarea" ).$value( "" );
					break;
				case "save":
					dom.$query( "[action=save]" ).$loading( true );
					o.$onsave( dom.$query( "textarea" ).$value() )
						.then( str => {
							dom.$query( ".editText-text" ).$text( str );
							dom.$rmAttr( "data-editing" );
						} )
						.finally( () => dom.$query( "[action=save]" ).$loading( false ) );
					break;
			}
		} );
		return dom;
	}
}
