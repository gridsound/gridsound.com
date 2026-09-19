"use strict";

class gscoSamples {
	constructor() {
		Object.seal( this );
		GSUaudioCurrentContext ||= GSUaudioContext();
		DOM.samplesPageHead.$onclick( this.#onclickMenu.bind( this ) );
		new gsuiReorder( {
			$root: DOM.samplesPageGroups,
			$parentSelector: "#samplesPageGroups",
			$itemSelector: "gsco-samplegroup",
			$itemGripSelector: "gsco-samplegroup-head > [data-prop='grip']",
			$getTargetList: () => $noop,
			$onchange( o ) {
				gsapiClient.$reorderSamplegroup( o.$rdrItemId, o.$rdrItemOrderNow, o.$rdrItemOrderOld );
			},
			$ondrop( dropInfo ) {
				console.log( "$ondrop", dropInfo );
			},
		} );
		new gsuiReorder( {
			$root: DOM.samplesPageGroups,
			$parentSelector: "gsco-samplegroup-body",
			$itemSelector: "gsco-sample",
			$itemGripSelector: "gsco-sample-head > [data-prop='grip']",
			$getTargetList: () => $noop,
			$onchange( o ) {
				gsapiClient.$reorderSample( o.$rdrItemId, o.$rdrItemOrderNow, o.$rdrItemOrderOld, o.$rdrItemParentNow, o.$rdrItemParentOld );
			},
			$ondrop( dropInfo ) {
				console.log( "$ondrop", dropInfo );
			},
		} );
		DOM.samplesPageGroups.$listen( {
			[ GSCO_SAMPLEGROUP_LISTCHANGE ]: d => {
				this.#updateStorage();
				if ( d.$target.$tag() === "gsco-samplegroup" ) {
					const order = +d.$target.$getAttr( "order" );

					DOM.samplesPageGroups.$query( "gsco-samplegroup" ).$each( el => {
						const or = +$.$getAttr( el, "order" );

						if ( or > order ) {
							$.$setAttr( el, "order", or - 1 );
						}
					} );
				}
			},
		} );
	}

	// .........................................................................
	$show() {
		$body.$on( "keydown", this.#onkeydown.bind( this ) );
		this.#updateData().then( () => {
			DOM.samplesPageHead.$query( "[data-prop='open-groups']" ).$click();
		} );
	}
	$quit() {
		this.#empty();
		$body.$off( "keydown" );
	}

	// .........................................................................
	#empty() {
		DOM.samplesPageStorage.$empty();
		DOM.samplesPageGroups.$empty();
	}
	#updateData() {
		this.#empty();
		DOM.samplesPage.$addAttr( "data-loading" );
		return gsapiClient.$getSamples()
			.then( grps => {
				DOM.samplesPageGroups.$append( ...grps.map( g => {
					return $( "<gsco-samplegroup>" ).$setAttr( {
						"data-id": g.$id,
						open: false,
						name: g.$name,
						order: g.$order,
					} ).$message( "addsamples", g.$samples );
				} ) );
				this.#updateStorage();
				DOM.samplesPage.$rmAttr( "data-loading" );
			} )
			.catch( err => PAGES.$main.$error( err.code ) );
	}
	#updateStorage() {
		const max = gsapiClient.$user.samplesMaxBytes;
		const sum = DOM.samplesPageGroups.$query( "gsco-sample" ).$reduce( ( sum, el ) => sum + +$.$getAttr( el, "size" ), 0 );

		DOM.samplesPageStorage.$textHTML( GSTXreplace( GSTX.$samplesStorage,
			GSUmathRound( sum / max * 100, .1 ),
			GSUmathFloatReadable( sum ).join( " " ),
			GSUmathFloatReadable( max ).join( " " ),
		) );
	}
	#onkeydown( e ) {
		if ( e.key === "Tab" ) {
			e.preventDefault();
		} else if ( e.key === " " ) {
			const el = $( document.activeElement );
			const tag = el.$tag();

			if ( tag === "gsco-sample" ) {
				el.$message( "playToggle" );
			} else {
				$( "gsco-sample[playing]" ).$message( "pause" );
			}
			e.preventDefault();
		}
	}
	#onclickMenu( e ) {
		switch ( $.$dataProp( e.target ) ) {
			case "refresh": this.#updateData(); break;
			case "new-group": this.#newGroup(); break;
			case "open-groups": DOM.samplesPageGroups.$children().$rmAttr( "open" ).$addAttr( "open" ); break;
			case "close-groups": DOM.samplesPageGroups.$children().$rmAttr( "open" ); break;
		}
	}
	#newGroup() {
		gsapiClient.$newSamplegroup()
			.then( grp => {
				DOM.samplesPageGroups
					.$query( "gsco-samplegroup" )
					.$setAttr( "order", el => 1 + +$.$getAttr( el, "order" ) );
				DOM.samplesPageGroups.$prepend( $.$elem( "gsco-samplegroup", {
					"data-id": grp.$id,
					open: true,
					name: grp.$name,
					order: grp.$order,
				} ) );
			} );
	}
}
