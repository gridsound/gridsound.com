"use strict";

const GSCO_SAMPLEGROUP_DELETED = 1;
const GSCO_SAMPLES_UPDATE_STORAGE = 6;

class gscoSamplegroup extends gsui0ne {
	#nbSmp = 0;

	constructor() {
		const popId = GSUuuid();

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
					$.$elem( "gsco-samplegroup-name", { class: "gsui-ellipsis" } ),
					$.$elem( "gsco-samplegroup-nbsamples" ),
					$.$elem( "gsco-samplegroup-size" ),
					$.$elem( "gsui-button", { "data-prop": "record", icon: "microphone", model: "submit", "data-tooltip": GSTX.$samplesRecord } ),
					$.$elem( "gsui-button", { "data-prop": "addSample", icon: "file-plus", model: "submit", "data-tooltip": GSTX.$samplesUpload } ),
					$.$elem( "gsui-button", { "data-prop": "options", popovertarget: popId, icon: "ellipsis-v" } ),
				),
				$.$elem( "gsui-dropdown", { id: popId },
					$.$elem( "gsui-dropdown-option", { value: "rename", icon: "pen",   name: GSTX.$rename } ),
					$.$elem( "gsui-dropdown-option", { value: "delete", icon: "trash", name: GSTX.$delete, danger: true, desc: "there is no recycle bin, be careful" } ),
				),
				$.$elem( "gsco-samplegroup-body", null,
					$.$elem( "gsco-samplegroup-placeholder", null, GSTX.$yourSamplegroupPH ),
				),
			],
			$elements: {
				$head: "gsco-samplegroup-head",
				$name: "gsco-samplegroup-name",
				$body: "gsco-samplegroup-body",
				$size: "gsco-samplegroup-size",
				$nbSamples: "gsco-samplegroup-nbsamples",
				$menuBtn: "[data-prop='options']",
				$recordBtn: "[data-prop='record']",
				$addSampleBtn: "[data-prop='addSample']",
			},
		} );
		this.$elements.$head.$on( {
			click: this.#onclick.bind( this ),
			dblclick: this.#dblclick.bind( this ),
		} );
		this.$this.$listen( {
			[ GSEV_SAMPLE_CLONEMP3 ]: d => this.#cloneToMp3( ...d.$args ),
			[ GSEV_SAMPLE_CONVERTMP3 ]: d => this.#convertToMp3( ...d.$args ),
			[ GSEV_SAMPLE_DELETED ]: d => ( this.#sampleDeleted( d.$target ), true ),
			[ GSEV_DROPDOWN_CLICK ]: d => this.#clickDropdown( d.$args[ 0 ] ),
			[ GSEV_BUFFEREDITOR_SAVE ]: d => this.#updateBuffer( d.$args[ 0 ], d ),
			[ GSEV_BUFFEREDITOR_EXTRACT ]: d => this.#extractSelection( d.$args[ 0 ], d ),
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
	static #getBufData( arr ) {
		return gswaContext.$decodeAudioData( arr )
			.then( buf => [ buf, gsuiWaveform.$getPathChans( buf, 512, 256 ) ] );
	}
	#updateInfo() {
		let nbSmp = 0;
		const size = this.$elements.$body.$query( "gsui-sample" ).$reduce( ( sum, el ) => {
			const sz = +$.$getAttr( el, "size" );

			nbSmp += sz > 0;
			return sum + sz;
		}, 0 );

		this.#nbSmp = nbSmp;
		this.$elements.$size.$text( GSUmathFloatHuman( size ) );
		this.$elements.$nbSamples.$text( nbSmp );
	}
	#addSamples( smps ) {
		this.$elements.$body.$append(
			...smps.map( smp =>
				$( "<gsui-sample>" )
					.$setAttr( {
						"data-id": smp.$id,
						hash: smp.$hash,
						order: smp.$order,
						format: smp.$format,
						duration: smp.$duration,
						size: smp.$size,
						name: smp.$name,
						created: smp.$created,
						updated: smp.$updated,
					} )
					.$message( GSEV_SAMPLE_DRAW, smp.$waves )
					.$message( GSEV_API_PROMISE, "rename", gsapiClient.$renameSample )
					.$message( GSEV_API_PROMISE, "delete", gsapiClient.$deleteSample )
			)
		);
		this.#updateInfo();
	}
	#getMp3( smpId, url ) {
		let blob;

		return fetch( url )
			.then( res => res.arrayBuffer() )
			.then( arr => gswaContext.$decodeAudioData( arr ) )
			.then( buf => gswaBufferToFile.$convert( buf, "mp3" ) )
			.then( blobby => ( blob = blobby ).arrayBuffer() )
			.then( arr => gscoSamplegroup.#getBufData( arr ) )
			.then( ( [ buf, paths ] ) => ( {
				$idsample: smpId,
				$file: blob,
				$nbchannels: buf.numberOfChannels,
				$duration: buf.duration,
				$wave0: paths[ 0 ],
				$wave1: paths[ 1 ],
			} ) );
	}
	#convertToMp3( smpId, url ) {
		this.#getMp3( smpId, url )
			.then( obj => gsapiClient.$convertSampleToMP3( obj ) )
			.then( smp => {
				this.$elements.$body.$query( `[data-id="${ smpId }"]` )
					.$setAttr( {
						size: smp.$size,
						hash: smp.$hash,
						format: smp.$format,
						duration: smp.$duration,
						updated: smp.$updated,
					} )
					.$message( GSEV_SAMPLE_DRAW, smp.$waves );
				this.#updateInfo();
				this.$this.$dispatch( GSCO_SAMPLES_UPDATE_STORAGE );
			} )
			.catch( err => $popup.$alert( GSTX.$uploadErr, err.msg ) );
	}
	#cloneToMp3( smpId, url ) {
		this.#getMp3( smpId, url )
			.then( obj => gsapiClient.$cloneSampleToMP3( obj ) )
			.then( smp => {
				this.#incrOrder( smp.$order, +1 );
				this.#addSamples( [ smp ] );
				this.$this.$dispatch( GSCO_SAMPLES_UPDATE_STORAGE );
			} )
			.catch( err => $popup.$alert( GSTX.$uploadErr, err.msg ) );
	}
	#sampleDeleted( elSmp ) {
		this.#incrOrder( +elSmp.$getAttr( "order" ), -1 );
		this.#updateInfo();
	}
	#incrOrder( limit, incr ) {
		this.$elements.$body
			.$query( "gsui-sample" )
			.$setAttr( "order", el => {
				const ordr = +$.$getAttr( el, "order" );

				return ordr + ( ordr >= limit ? incr : 0 );
			} );
	}

	// .........................................................................
	#onclick( e ) {
		switch ( $.$dataProp( e.target ) ) {
			case "expand": this.#clickExpand(); break;
			case "record": this.#clickRecord(); break;
			case "addSample": this.#clickAddSample(); break;
		}
	}
	#dblclick( e ) {
		if ( $.$tag( e.target ) === "gsco-samplegroup-name" ) {
			this.#clickRename();
		}
	}
	#clickDropdown( act ) {
		switch ( act ) {
			case "rename": this.#clickRename(); break;
			case "delete": this.#clickDelete(); break;
		}
	}
	#clickRename() {
		this.$elements.$menuBtn.$loading( true );
		return $popup.$prompt( GSTX.$samplesMvGroup, "", this.$this.$getAttr( "name" ) )
			.then( name => {
				if ( !name || name === this.$this.$getAttr( "name" ) ) {
					throw "";
				}
				return name;
			} )
			.then( name => gsapiClient.$renameSamplegroup( this.$this.$dataId(), name ) )
			.then( name => this.$this.$setAttr( "name", name ) )
			.finally( () => this.$elements.$menuBtn.$loading( false ) );
	}
	#clickExpand() {
		this.$this.$togAttr( "open" );
	}
	#clickRecord() {
		this.$elements.$recordBtn.$loading( true );
	}
	#clickDelete() {
		( this.#nbSmp > 0
			? $popup.$confirm( GSTX.$samplesRmGroupPopupTitle, GSTX.$samplesRmGroupPopupQuestion )
			: Promise.resolve( true )
		).then( b => {
			if ( b ) {
				this.$elements.$menuBtn.$loading( true );
				gsapiClient.$deleteSamplegroup( this.$this.$dataId() )
					.then( () => this.$this.$empty().$dispatch( GSCO_SAMPLEGROUP_DELETED ).$remove() )
					.finally( () => this.$elements.$menuBtn.$loading( false ) );
			}
		} );
	}
	#clickAddSample() {
		let filesSave;

		GSUopenFileManager( { $multiple: true, $accept: "audio/*" } )
			.then( files => {
				this.$elements.$addSampleBtn.$loading( true );
				filesSave = files;
				return Promise.all( files.map( f => {
					return f.arrayBuffer()
						.then( arr => gscoSamplegroup.#getBufData( arr ) );
				} ) );
			} )
			.then( arr => gsapiClient.$addSamples(
				this.$this.$dataId(),
				arr.map( ( [ buf, paths ], i ) => ( {
					$file: filesSave[ i ],
					$wave0: paths[ 0 ],
					$wave1: paths[ 1 ],
					$duration: buf.duration,
					$nbchannels: buf.numberOfChannels,
				} ) ),
			) )
			.then( smps => this.#addSamplesThen( smps ) )
			.finally( () => this.$elements.$addSampleBtn.$loading( false ) )
			.catch( err => {
				const msg = err.msg || err;
				const msg2 = msg === "sample:no-space"
					? gsapiClient.$user.premium ? GSTX.$samplesNoSpacePrem : GSTX.$samplesNoSpace
					: msg;

				return $popup.$alert( GSTX.$uploadErr, msg2 );
			} );
	}
	#updateBuffer( buf, d ) {
		const bufEdit = d.$target;
		const smp = bufEdit.$closest( "gsui-sample" );
		const format = smp.$getAttr( "format" );
		const newFormat = GSUisOneOf( format, "wav", "mp3" ) ? format : "wav";
		let blob;

		gswaBufferToFile.$convert( buf, newFormat )
			.then( blobby => ( blob = blobby ).arrayBuffer() )
			.then( arr => gscoSamplegroup.#getBufData( arr ) )
			.then( ( [ buf2, paths ] ) => {
				blob.name = smp.$getAttr( "name" );
				return gsapiClient.$updateSample( {
					$idsample: smp.$dataId(),
					$file: blob,
					$nbchannels: buf2.numberOfChannels,
					$duration: buf2.duration,
					$wave0: paths[ 0 ],
					$wave1: paths[ 1 ],
				} );
			} )
			.then( smp => {
				this.$elements.$body.$query( `[data-id="${ smp.$id }"]` )
					.$setAttr( {
						size: smp.$size,
						hash: smp.$hash,
						format: smp.$format,
						duration: smp.$duration,
						updated: smp.$updated,
					} )
					.$message( GSEV_SAMPLE_DRAW, smp.$waves );
				this.#updateInfo();
				this.$this.$dispatch( GSCO_SAMPLES_UPDATE_STORAGE );
			} )
			.finally( () => bufEdit.$rmAttr( "saving" ) );
	}
	#extractSelection( buf, d ) {
		gswaBufferToFile.$convert( buf, "wav" )
			.then( blob => {
				const name = d.$target.$closest( "gsui-sample" ).$getAttr( "name" );
				const paths = gsuiWaveform.$getPathChans( buf, 512, 256 );

				blob.name = name;
				return gsapiClient.$addSamples( this.$this.$dataId(), [ {
					$file: blob,
					$wave0: paths[ 0 ],
					$wave1: paths[ 1 ],
					$duration: buf.duration,
					$nbchannels: buf.numberOfChannels,
				} ] );
			} )
			.then( smps => this.#addSamplesThen( smps ) )
			.finally( () => d.$target.$rmAttr( "extracting" ) );
	}
	#addSamplesThen( smps ) {
		this.#incrOrder( -1, smps.length );
		this.$elements.$body.$prepend( ...smps.map( smp =>
			$( "<gsui-sample>" )
				.$setAttr( {
					"data-id": smp.$id,
					hash: smp.$hash,
					order: smp.$order,
					format: smp.$format,
					duration: smp.$duration,
					size: smp.$size,
					name: smp.$name,
					desc: smp.$desc,
					created: smp.$created,
					updated: smp.$updated,
				} )
				.$message( GSEV_SAMPLE_DRAW, smp.$waves )
				.$message( GSEV_API_PROMISE, "rename", gsapiClient.$renameSample )
				.$message( GSEV_API_PROMISE, "delete", gsapiClient.$deleteSample )
		) );
		this.#updateInfo();
		this.$this.$dispatch( GSEV_SAMPLE_ADDED );
	}
}

$.$define( "gsco-samplegroup", gscoSamplegroup );
