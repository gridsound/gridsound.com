"use strict";

const GSCO_SAMPLEGROUP_DELETED = 1;
const GSCO_SAMPLE_ADDED = 2;
const GSCO_SAMPLE_DELETED = 3;

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
			[ GSCO_SAMPLE_DELETED ]: d => {
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
		const size = this.$elements.$body.$query( "gsco-sample" ).$reduce( ( sum, el ) => {
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
			...smps.map( smp =>
				$( "<gsco-sample>" )
					.$setAttr( {
						"data-id": smp.$id,
						order: smp.$order,
						format: smp.$format,
						duration: smp.$duration,
						size: smp.$size,
						name: smp.$name,
						desc: smp.$desc,
						created: smp.$created,
						updated: smp.$updated,
					} )
					.$message( "waveL", smp.$waveformleft )
					.$message( "waveR", smp.$waveformright )
			)
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
					.then( () => this.$this.$empty().$dispatch( GSCO_SAMPLEGROUP_DELETED ).$remove() )
					.finally( () => this.$elements.$deleteBtn.$rmAttr( "loading" ) );
			}
		} );
	}
	#clickAddSample() {
		let arrBuf;
		let file;
		let hash;

		GSUopenFileManager()
			.then( files => {
				this.$elements.$addSampleBtn.$addAttr( "loading" );
				file = files[ 0 ];
				return GSUgetFileContent( file, "array" );
			} )
			.then( arr => {
				arrBuf = arr;
				return GSUhashBuffer( arr );
			} )
			.then( sha1 => {
				hash = sha1;
				return GSUaudioCurrentContext.decodeAudioData( arrBuf );
			} )
			.then( buf => {
				const dur = buf.duration;
				const chanL = buf.getChannelData( 0 );
				const chanR = buf.getChannelData( 1 );
				const pathL = gscoSamplegroup.$drawPath( 512, 256, chanL, dur, 0, dur );
				const pathR = gscoSamplegroup.$drawPath( 512, 256, chanR, dur, 0, dur );

				return gsapiClient.$addSample( {
					$idgroup: this.$this.$dataId(),
					$hash: hash,
					$file: file,
					$duration: dur,
					$waveformleft: pathL.join( "," ),
					$waveformright: pathR.join( "," ),
				} );
			} )
			.then( smp => {
				this.$elements.$body
					.$query( "gsco-sample" )
					.$setAttr( "order", el => 1 + +$.$getAttr( el, "order" ) );
				this.$elements.$body.$prepend(
					$( "<gsco-sample>" )
						.$setAttr( {
							"data-id": smp.$id,
							order: smp.$order,
							format: smp.$format,
							duration: smp.$duration,
							size: smp.$size,
							name: smp.$name,
							desc: smp.$desc,
							created: smp.$created,
							updated: smp.$updated,
						} )
						.$message( "waveL", smp.$waveformleft )
						.$message( "waveR", smp.$waveformright )
				);
				this.#updateInfo();
				this.$this.$dispatch( GSCO_SAMPLE_ADDED );
			} )
			.finally( () => this.$elements.$addSampleBtn.$rmAttr( "loading" ) )
			.catch( err => {
				const msg = err.msg || err;
				const msg2 = msg === "sample:no-space"
					? gsapiClient.$user.premium ? GSTX.$samplesNoSpacePrem : GSTX.$samplesNoSpace
					: msg;

				return $popup.$alert( GSTX.$uploadErr, msg2 );
			} );
	}
	static $drawPath( w, h, data, bufDur, start, dur ) {
		const h2 = h / 2;
		const sampleRate = data.length / bufDur;
		const startSample = start * sampleRate;
		const spp = dur * sampleRate / w;
		const arrA = [];
		const arrB = [];

		for ( let px = 0; px < w; ++px ) {
			const a = Math.floor( startSample + px * spp );
			const b = Math.max( a + 1, Math.floor( startSample + ( px + 1 ) * spp ) );
			let min = 0;
			let max = 0;

			if ( b > 0 && a < data.length ) {
				const len = Math.min( b, data.length );

				min = Infinity;
				max = -Infinity;
				for ( let i = Math.max( 0, a ); i < len; ++i ) {
					const v = data[ i ];

					if ( v < min ) { min = v; }
					if ( v > max ) { max = v; }
				}
				min = GSUmathClamp( min, -1, 1 );
				max = GSUmathClamp( max, -1, 1 );
			}
			arrA.push( `${ px } ${ Math.round( -max * h2 ) }` );
			arrB.push( `${ px } ${ Math.round( -min * h2 ) }` );
		}
		return arrA.concat( arrB.reverse() );
	}
}

$.$define( "gsco-samplegroup", gscoSamplegroup );
