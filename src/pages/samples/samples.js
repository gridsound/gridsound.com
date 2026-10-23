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
			$itemSelector: "gsui-sample",
			$itemGripSelector: "gsui-sample-head > [data-prop='grip']",
			$getTargetList: () => $noop,
			$onchange( o ) {
				gsapiClient.$reorderSample( o.$rdrItemId, o.$rdrItemOrderNow, o.$rdrItemOrderOld, o.$rdrItemParentNow, o.$rdrItemParentOld );
			},
			$ondrop( dropInfo ) {
				console.log( "$ondrop", dropInfo );
			},
		} );
		DOM.samplesPageGroups.$listen( {
			[ GSCO_SAMPLES_UPDATE_STORAGE ]: () => this.#updateStorage(),
			[ GSEV_SAMPLE_ADDED ]: () => this.#updateStorage(),
			[ GSEV_SAMPLE_DELETED ]: () => this.#updateStorage(),
			[ GSCO_SAMPLEGROUP_DELETED ]: d => {
				const order = +d.$target.$getAttr( "order" );

				this.#updateStorage();
				DOM.samplesPageGroups.$query( "gsco-samplegroup" ).$each( el => {
					const or = +$.$getAttr( el, "order" );

					if ( or > order ) {
						$.$setAttr( el, "order", or - 1 );
					}
				} );
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
		DOM.samplesPageStoragePerc.$text( 0 );
		DOM.samplesPageStorageSum.$text( GSUmathFloatHuman( 0 ) );
		DOM.samplesPageStorageMax.$text( GSUmathFloatHuman( 0 ) );
		DOM.samplesPageStorageProgress.$value( 0 );
		DOM.samplesPageGroups.$empty();
	}
	#updateData() {
		this.#empty();
		DOM.samplesPageRefresh.$addAttr( "loading" );
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
			} )
			.catch( err => PAGES.$main.$error( err.code ) )
			.finally( () => {
				DOM.samplesPageRefresh.$rmAttr( "loading" );
				DOM.samplesPage.$rmAttr( "data-loading" );
			} );
	}
	#updateStorage() {
		const sum = DOM.samplesPageGroups.$query( "gsui-sample" ).$reduce( ( sum, el ) => sum + +$.$getAttr( el, "size" ), 0 );
		const max = gsapiClient.$user.samplesMaxBytes;
		const perc = GSUmathRound( sum / max * 100, .1 );

		DOM.samplesPageStoragePerc.$text( perc );
		DOM.samplesPageStorageProgress.$value( perc / 100 );
		DOM.samplesPageStorageSum.$text( GSUmathFloatHuman( sum ) );
		DOM.samplesPageStorageMax.$text( GSUmathFloatHuman( max ) );
	}
	#onkeydown( e ) {
		if ( e.key === "Tab" ) {
			e.preventDefault();
		} else if ( e.key === " " ) {
			const el = $( document.activeElement );
			const tag = el.$tag();

			if ( tag === "gsui-sample" ) {
				el.$message( "playToggle" );
			} else {
				$( "gsui-sample[playing]" ).$message( "pause" );
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
		DOM.samplesPageNewGrp.$addAttr( "loading" );
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
			} )
			.finally( () => DOM.samplesPageNewGrp.$rmAttr( "loading" ) );
	}
}
