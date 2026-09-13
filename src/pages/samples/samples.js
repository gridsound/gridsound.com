"use strict";

const GSCO_SAMPLEGROUP_LISTCHANGE = 1;

class gscoSamples {
	constructor() {
		Object.seal( this );
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
		DOM.samplesPageGroups.$listen( {
			[ GSCO_SAMPLEGROUP_LISTCHANGE ]: () => this.#updateStorage(),
		} );
	}

	// .........................................................................
	$show() {
		gsapiClient.$getSamples()
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
				DOM.samplesPageHead.$query( "[data-prop='open-groups']" ).$click();
			} );
	}
	$quit() {
		DOM.samplesPageStorage.$empty();
		DOM.samplesPageGroups.$empty();
	}

	// .........................................................................
	#updateStorage() {
		const max = gsapiClient.$user.samplesMaxBytes;
		const sum = DOM.samplesPageGroups.$query( "gsco-sample" ).$reduce( ( sum, el ) => sum + +$.$getAttr( el, "size" ), 0 );

		DOM.samplesPageStorage.$textHTML( GSTXreplace( GSTX.$samplesStorage,
			GSUmathRound( sum / max * 100, .1 ),
			GSUmathFloatReadable( sum ).join( "" ),
			GSUmathFloatReadable( max ).join( "" ),
		) );
	}
	#onclickMenu( e ) {
		switch ( $.$dataProp( e.target ) ) {
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

// .............................................................................
class gscoSamplegroup extends gsui0ne {
	#nbSmp = 0;
	#resizing = false;

	constructor() {
		super( {
			$tagName: "gsco-samplegroup",
			$template: [
				$.$elem( "gsco-samplegroup-head", null,
					$.$button( { "data-prop": "grip" },
						$.$icon( { icon: "grip-v" } ),
					),
					$.$button( { "data-prop": "expand" },
						$.$icon( { icon: "caret-right" } ),
					),
					$.$icon( { icon: "folder-music" } ),
					$.$elem( "gsco-samplegroup-name" ),
					$.$elem( "gsui-com-button", { "data-prop": "rename", icon: "pen", "data-tooltip": GSTX.$samplesMvGroup } ),
					$.$elem( "gsco-samplegroup-info" ),
					$.$elem( "gsui-com-button", { "data-prop": "addSample", icon: "file-plus", type: "submit", "data-tooltip": GSTX.$samplesUpload } ),
					$.$elem( "gsui-com-button", { "data-prop": "delete", icon: "trash", type: "danger", "data-tooltip": GSTX.$samplesRmGroup } ),
				),
				$.$elem( "gsco-samplegroup-body" ),
				$.$elem( "gsco-samplegroup-placeholder", null, GSTX.$yourSamplegroupPH ),
				$.$elem( "gsco-samplegroup-expand-grip", null,
					$.$icon( { icon: "grip-h" } ),
				),
			],
			$elements: {
				$head: "gsco-samplegroup-head",
				$name: "gsco-samplegroup-name",
				$body: "gsco-samplegroup-body",
				$info: "gsco-samplegroup-info",
				$gripH: "gsco-samplegroup-expand-grip",
				$renameBtn: "[data-prop='rename']",
				$deleteBtn: "[data-prop='delete']",
				$addSampleBtn: "[data-prop='addSample']",
			},
		} );
		this.$elements.$head.$onclick( this.#onclick.bind( this ) );
		this.$elements.$gripH.$on( {
			pointerdown: e => {
				this.$elements.$gripH.$setPtrCapture( e.pointerId );
				this.#resizing = true;
			},
			pointerup: e => {
				this.$elements.$gripH.$relPtrCapture( e.pointerId );
				this.#resizing = false;
			},
			pointermove: e => {
				if ( this.#resizing ) {
					const h = e.pageY - $html.$scrollY() - this.$this.$bcr().y + 8;

					this.$this.$height( h, "px" ).$setAttr( "open", h > 96 );
				}
			},
		} );
	}

	// .........................................................................
	static get observedAttributes() {
		return [ "name", "open", "order" ];
	}
	$attributeChanged( prop, val ) {
		switch ( prop ) {
			case "name": this.$elements.$name.$text( val ); break;
			case "order": this.$this.$css( "order", val ); break;
			case "open":
				if ( val === "" && !this.#resizing ) {
					const nb = this.$elements.$body.$childrenCount();
					const smpsH = nb * 100 + ( nb - 1 ) * 6;

					this.$this.$height( GSUmathClamp( 50 + smpsH + 18, 120, 600 ), "px" );
				}
				break;
		}
	}
	$onmessage( msg, val ) {
		switch ( msg ) {
			case "addsamples": this.#addSamples( val ); break;
		}
	}

	// .........................................................................
	#updateInfo() {
		const nbSmp = this.$elements.$body.$childrenCount();
		const size = this.$elements.$body.$children().$reduce( ( sum, el ) => sum + +$.$getAttr( el, "size" ), 0 );
		const size2 = GSUmathFloatReadable( size ).join( "" );

		this.#nbSmp = nbSmp;
		this.$elements.$info.$textHTML( GSTXreplace( GSTX.$samplesGroupSize, nbSmp, size2 ) );
	}
	#addSamples( smps ) {
		this.$elements.$body.$append(
			...smps.map( smp => $.$elem( "gsco-sample", {
				"data-id": smp.$id,
				order: smp.$order,
				type: smp.$type,
				size: smp.$size,
				name: smp.$name,
				desc: smp.$desc,
				created: smp.$created,
				updated: smp.$updated,
			} ) )
		);
		this.#updateInfo();
	}

	// .........................................................................
	#onclick( e ) {
		switch ( $.$dataProp( e.target ) ) {
			case "rename": this.#clickRename(); break;
			case "expand": this.#clickExpand(); break;
			case "delete": this.#clickDelete(); break;
			case "addSample": this.#clickAddSample(); break;
		}
	}
	#clickRename() {
		this.$elements.$renameBtn.$addAttr( "loading" );
		return $popup.$prompt( GSTX.$samplesMvGroup, "", this.$this.$getAttr( "name" ) )
			.then( name => {
				if ( !name || name === this.$this.$getAttr( "name" ) ) {
					throw "";
				}
				return name;
			} )
			.then( name => gsapiClient.$renameSamplegroup( this.$this.$dataId(), name ) )
			.then( name => this.$this.$setAttr( "name", name ) )
			.finally( () => this.$elements.$renameBtn.$rmAttr( "loading" ) );
	}
	#clickExpand() {
		this.$this.$togAttr( "open" );
	}
	#clickDelete() {
		( this.#nbSmp > 0
			? $popup.$confirm( GSTX.$samplesRmGroupPopupTitle, GSTX.$samplesRmGroupPopupQuestion )
			: Promise.resolve( true )
		).then( b => {
			if ( b ) {
				this.$elements.$deleteBtn.$addAttr( "loading" );
				gsapiClient.$deleteSamplegroup( this.$this.$dataId() )
					.then( () => this.$this.$empty().$dispatch( GSCO_SAMPLEGROUP_LISTCHANGE ).$remove() )
					.finally( () => this.$elements.$deleteBtn.$rmAttr( "loading" ) );
			}
		} );
	}
	#clickAddSample() {
		GSUopenFileManager().then( files => {
			this.$elements.$addSampleBtn.$addAttr( "loading" );
			GSUgetFileContent( files[ 0 ], "array" )
				.then( arr => {
					const hash = GSUhashBufferV1( new Uint8Array( arr ) );

					return gsapiClient.$addSample( this.$this.$dataId(), hash, files[ 0 ] );
				} )
				.then( smp => {
					this.$elements.$body.$prepend( $.$elem( "gsco-sample", {
						"data-id": smp.$id,
						order: smp.$order,
						type: smp.$type,
						size: smp.$size,
						name: smp.$name,
						desc: smp.$desc,
						created: smp.$created,
						updated: smp.$updated,
					} ) );
					this.#updateInfo();
					this.$this.$dispatch( GSCO_SAMPLEGROUP_LISTCHANGE );
				} )
				.finally( () => this.$elements.$addSampleBtn.$rmAttr( "loading" ) );
		} );
	}
}

$.$define( "gsco-samplegroup", gscoSamplegroup );

// .............................................................................
class gscoSample extends gsui0ne {
	constructor() {
		super( {
			$tagName: "gsco-sample",
			$template: [
				$.$elem( "gsco-sample-in", null,
					$.$elem( "gsco-sample-head", null,
						$.$button( { "data-prop": "grip" },
							$.$icon( { icon: "grip-v" } ),
						),
						$.$elem( "gsui-com-button", { "data-prop": "play", icon: "play" } ),
						$.$elem( "gsui-com-button", { "data-prop": "delete", icon: "trash", type: "danger" } ),
					),
					$.$elem( "gsco-sample-body", null,
					),
				),
			],
			$elements: {
				// $xxx: ".xxx",
			},
		} );
	}

	// .........................................................................
	static get observedAttributes() {
		return [ "order" ];
		// type: smp.$type,
		// size: smp.$size,
		// name: smp.$name,
		// desc: smp.$desc,
		// created: smp.$created,
		// updated: smp.$updated,
	}
	$attributeChanged( prop, val ) {
		switch ( prop ) {
			case "order": this.$this.$css( "order", val ); break;
		}
	}
}

$.$define( "gsco-sample", gscoSample );
