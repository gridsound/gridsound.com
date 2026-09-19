"use strict";

const GSCO_SAMPLEGROUP_LISTCHANGE = 1;

class gscoSamplegroup extends gsui0ne {
	#nbSmp = 0;

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
				$.$elem( "gsco-samplegroup-body", null,
					$.$elem( "gsco-samplegroup-placeholder", null, GSTX.$yourSamplegroupPH ),
				),
			],
			$elements: {
				$head: "gsco-samplegroup-head",
				$name: "gsco-samplegroup-name",
				$body: "gsco-samplegroup-body",
				$info: "gsco-samplegroup-info",
				$renameBtn: "[data-prop='rename']",
				$deleteBtn: "[data-prop='delete']",
				$addSampleBtn: "[data-prop='addSample']",
			},
		} );
		this.$elements.$head.$on( {
			click: this.#onclick.bind( this ),
			dblclick: this.#dblclick.bind( this ),
		} );
		this.$this.$listen( {
			[ GSCO_SAMPLEGROUP_LISTCHANGE ]: d => {
				const order = +d.$target.$getAttr( "order" );

				this.$elements.$body.$query( "gsco-sample" ).$each( el => {
					const or = +$.$getAttr( el, "order" );

					if ( or > order ) {
						$.$setAttr( el, "order", or - 1 );
					}
				} );
				this.#updateInfo();
				return true;
			},
		} );
	}

	// .........................................................................
	static get observedAttributes() {
		return [ "name", "order" ];
	}
	$attributeChanged( prop, val ) {
		switch ( prop ) {
			case "name": this.$elements.$name.$text( val ); break;
			case "order": this.$this.$css( "order", val ); break;
		}
	}
	$onmessage( msg, val ) {
		switch ( msg ) {
			case "addsamples": this.#addSamples( val ); break;
		}
	}

	// .........................................................................
	#updateInfo() {
		let nbSmp = 0;
		const size = this.$elements.$body.$children().$reduce( ( sum, el ) => {
			const sz = +$.$getAttr( el, "size" );

			nbSmp += sz > 0;
			return sum + sz;
		}, 0 );
		const size2 = GSUmathFloatReadable( size ).join( " " );

		this.#nbSmp = nbSmp;
		this.$elements.$info.$textHTML( GSTXreplace( GSTX.$samplesGroupSize, nbSmp, size2 ) );
	}
	#addSamples( smps ) {
		this.$elements.$body.$append(
			...smps.map( smp => $.$elem( "gsco-sample", {
				"data-id": smp.$id,
				order: smp.$order,
				format: smp.$format,
				duration: smp.$duration,
				size: smp.$size,
				name: smp.$name,
				desc: smp.$desc,
				waveform: smp.$waveform,
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
	#dblclick( e ) {
		if ( $.$tag( e.target ) === "gsco-samplegroup-name" ) {
			this.#clickRename();
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
		let file;
		let hash;

		GSUopenFileManager()
			.then( files => {
				this.$elements.$addSampleBtn.$addAttr( "loading" );
				file = files[ 0 ];
				return GSUgetFileContent( file, "array" );
			} )
			.then( arr => {
				hash = GSUhashBufferV1( new Uint8Array( arr ) );
				return GSUaudioCurrentContext.decodeAudioData( arr );
			} )
			.then( buf => {
				const [ l, r ] = gsuiWaveform.$wfGetArrayFromBuffer( 512, buf );

				for ( let i in l ) {
					l[ i ] = GSUmathClamp( l[ i ] - 1, 0,  1 ) * 127 | 0;
					r[ i ] = GSUmathClamp( r[ i ],     0, -1 ) * 127 | 0;
				}

				const wf = gsuiWaveform.$wfArraysToPolygonPoints( l, r );

				return gsapiClient.$addSample( {
					$idgroup: this.$this.$dataId(),
					$hash: hash,
					$file: file,
					$duration: buf.duration,
					$waveform: wf,
				} );
			} )
			.then( smp => {
				this.$elements.$body
					.$query( "gsco-sample" )
					.$setAttr( "order", el => 1 + +$.$getAttr( el, "order" ) );
				this.$elements.$body.$prepend( $.$elem( "gsco-sample", {
					"data-id": smp.$id,
					order: smp.$order,
					format: smp.$format,
					duration: smp.$duration,
					size: smp.$size,
					name: smp.$name,
					desc: smp.$desc,
					waveform: smp.$waveform,
					created: smp.$created,
					updated: smp.$updated,
				} ) );
				this.#updateInfo();
				this.$this.$dispatch( GSCO_SAMPLEGROUP_LISTCHANGE );
			} )
			.finally( () => this.$elements.$addSampleBtn.$rmAttr( "loading" ) );
	}
}

$.$define( "gsco-samplegroup", gscoSamplegroup );
