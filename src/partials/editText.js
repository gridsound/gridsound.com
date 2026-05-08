"use strict";

class gscoPartialEditText {
	static $createForm( o ) {
		const dom = $( $.$flex( { class: "editText", y: true, g16: true },
			$.$div( { class: "editText-text" } ),
			$.$elem( "textarea", { class: "editText-textarea" } ),
			$.$flex( { x: true, xcenter: true, g16: true },
				$.$elem( "gsui-com-button", { action: "edit", text: o.$edit } ),
				$.$elem( "gsui-com-button", { action: "cancel", text: o.$cancel } ),
				$.$elem( "gsui-com-button", { action: "save", text: o.$save, type: "submit" } ),
			),
		) );

		dom.$query( "gs-flex" ).$onclick( e => {
			const act = $( e.target ).$parent().$getAttr( "action" );

			switch ( act ) {
				case "edit":
					dom.$addAttr( "data-editing" );
					dom.$query( "textarea" ).$value( dom.$query( ".editText-text" ).$text() ).$focus();
					break;
				case "cancel":
					dom.$rmAttr( "data-editing" );
					dom.$query( "textarea" ).$value( "" );
					break;
				case "save":
					dom.$query( "[action=save]" ).$addAttr( "loading" );
					o.$onsave( dom.$query( "textarea" ).$value() )
						.then( bio => {
							dom.$query( ".editText-text" ).$text( bio );
							dom.$rmAttr( "data-editing" );
						} )
						.finally( () => {
							dom.$query( "[action=save]" ).$rmAttr( "loading" );
						} );
					break;
			}
		} );
		return dom;
	}
}
