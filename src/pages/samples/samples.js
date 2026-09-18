"use strict";

const GSCO_SAMPLEGROUP_LISTCHANGE = 1;

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
		$body.$off( "keypress" );
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
			} );
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
			dblclick: () => this.#setHeightAuto(),
			pointerdown: e => {
				this.$elements.$gripH.$setPtrCapture( e.pointerId );
				this.#resizing = true;
				e.preventDefault();
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
		return [ "name", "open", "order" ];
	}
	$attributeChanged( prop, val ) {
		switch ( prop ) {
			case "name": this.$elements.$name.$text( val ); break;
			case "order": this.$this.$css( "order", val ); break;
			case "open":
				if ( val === "" && !this.#resizing ) {
					this.#setHeightAuto();
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
	#setHeightAuto() {
		const nb = this.$elements.$body.$childrenCount();
		const smpsH = nb * 100 + ( nb - 1 ) * 6;

		this.$this.$height( GSUmathClamp( 50 + smpsH + 18, 120, 560 ), "px" );
	}
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

// .............................................................................
class gscoSample extends gsui0ne {
	#currentTiming = false;
	#audioElem = null;
	#frameId = null;

	constructor() {
		super( {
			$tagName: "gsco-sample",
			$template: [
				$.$elem( "gsco-sample-in", null,
					$.$elem( "gsco-sample-head", null,
						$.$button( { "data-prop": "grip" },
							$.$icon( { icon: "grip-v" } ),
						),
						$.$elem( "gsui-com-button", { "data-prop": "play", icon: "play", type: "submit" } ),
						$.$elem( "gsui-com-button", { "data-prop": "stop", icon: "stop", type: "submit", disabled: true } ),
						$.$elem( "gsco-sample-name" ),
						$.$elem( "gsui-com-button", { "data-prop": "rename", icon: "pen", "data-tooltip": GSTX.$samplesMvSample } ),
						$.$elem( "gsui-com-button", { "data-prop": "download", icon: "download", "data-tooltip": GSTX.$samplesDLSample } ),
						$.$elem( "gsco-sample-info", null,
							$.$div( null,
								$.$elem( "gsco-sample-duration" ),
								$.$elem( "gsco-sample-format" ),
							),
							$.$div( null,
								$.$elem( "gsco-sample-size" ),
							),
						),
						$.$elem( "gsui-com-button", { "data-prop": "delete", icon: "trash", type: "danger", "data-tooltip": GSTX.$samplesRmSample } ),
					),
					$.$elem( "gsco-sample-body", null,
						$.$elem( "gsco-sample-player", null,
							$.$elem( "svg", { viewBox: "0 -127 512 256", preserveAspectRatio: "none" },
								$.$elem( "polygon" ),
							),
							$.$elem( "gsco-sample-slider", null,
								$.$elem( "gsco-sample-cursor" ),
							),
						),
					),
				),
			],
			$attributes: {
				tabindex: -1,
			},
			$elements: {
				$name: "gsco-sample-name",
				$infoDur: "gsco-sample-duration",
				$infoFormat: "gsco-sample-format",
				$infoSize: "gsco-sample-size",
				$slider: "gsco-sample-slider",
				$cursor: "gsco-sample-cursor",
				$waveform: "gsco-sample-body polygon",
				$playBtn: "[data-prop='play']",
				$stopBtn: "[data-prop='stop']",
				$renameBtn: "[data-prop='rename']",
				$deleteBtn: "[data-prop='delete']",
			},
		} );
		this.$this.$onclick( this.#onclick.bind( this ) );
		this.$elements.$slider.$on( {
			pointerdown: this.#sliderPtrDown.bind( this ),
			pointermove: this.#sliderPtrMove.bind( this ),
			pointerup: this.#sliderPtrUp.bind( this ),
		} );
		this.#setSlider( 0 );
	}

	// .........................................................................
	static get observedAttributes() {
		return [ "order", "name", "format", "size", "duration", "waveform" ];
	}
	$attributeChanged( prop, val ) {
		switch ( prop ) {
			case "order": this.$this.$css( "order", val ); break;
			case "name": this.$elements.$name.$text( val ); break;
			case "duration": this.$elements.$infoDur.$text( `${ val } ${ GSTX.$unitSecondSec }` ); break;
			case "format": this.$elements.$infoFormat.$text( val ); break;
			case "size": this.$elements.$infoSize.$text( `${ GSUmathFloatReadable( +val ).join( " " ) }${ GSTX.$unitByteB }` ); break;
			case "waveform": this.#updateWaveform( val ); break;
		}
	}
	$onmessage( type ) {
		switch ( type ) {
			case "pause": this.#audioPlay( false ); break;
			case "playToggle": this.$elements.$playBtn.$click(); break;
		}
	}

	// .........................................................................
	#updateWaveform( o ) {
		this.$elements.$waveform.$setAttr( "points", o );
	}

	// .........................................................................
	#sliderPtrDown( e ) {
		this.$elements.$slider.$setPtrCapture( e.pointerId );
		this.#currentTiming = true;
		this.#sliderPtrMove( e );
		e.preventDefault();
		this.$this.$focus();
	}
	#sliderPtrMove( e ) {
		if ( this.#currentTiming ) {
			this.#setSlider( this.#getSliderVal( e.pageX ) );
		}
	}
	#sliderPtrUp( e ) {
		this.$elements.$slider.$relPtrCapture( e.pointerId );
		this.#currentTiming = false;
		if ( this.#audioElem ) {
			this.#audioElem.currentTime = this.#getSliderVal( e.pageX ) * this.#audioElem.duration;
		}
	}
	#getSliderVal( px ) {
		const bcr = this.$elements.$slider.$bcr();

		return ( px - bcr.x ) / bcr.w;
	}
	#setSlider( n ) {
		const p = GSUmathClamp( n, 0, 1 ) * 100;

		this.$elements.$cursor
			.$left( p, "%" )
			.$css( "opacity", p === 0 || p === 100 ? 0 : 1 );
	}

	// .........................................................................
	#initAudio() {
		if ( !this.#audioElem ) {
			const [ id, format ] = this.$this.$getAttr( "data-id", "format" );
			const btn = this.$elements.$playBtn;

			btn.$addAttr( "loading" );
			this.#audioElem = $( "<audio>" )
				.$on( {
					play: () => {
						btn.$setAttr( "icon", "pause" );
						this.$this.$addAttr( "playing" );
						this.$elements.$stopBtn.$disabled( false );
						this.#frameId = GSUsetInterval( this.#audioTimeUpdate.bind( this ), 1 / 60 );
					},
					pause: () => {
						this.$this.$rmAttr( "playing" );
						btn.$setAttr( "icon", "play" );
						if ( this.#audioElem.currentTime === 0 ) {
							this.$elements.$stopBtn.$disabled( true );
						}
						GSUclearInterval( this.#frameId );
					},
					ended: () => {
						this.#setSlider( 1 );
						this.$elements.$stopBtn.$disabled( true );
					},
					timeupdate: () => {
						this.#audioTimeUpdate();
					},
					loadeddata: () => {
						btn.$rmAttr( "loading" );
						this.#audioPlay( true );
					},
				} )
				.$setAttr( {
					src: `${ GSURL.$gsSmps }/${ id }.${ format }`,
					loop: true,
				} )
				.$get( 0 );
		}
	}
	#audioTimeUpdate() {
		if ( !this.#currentTiming ) {
			this.#setSlider( this.#audioElem.currentTime / this.#audioElem.duration );
		}
	}
	#audioPlay( b ) {
		if ( b ) {
			$( "gsco-sample[playing]" ).$message( "pause" );
			this.#audioElem.play();
		} else {
			this.#audioElem.pause();
		}
	}
	#audioStop() {
		this.#audioElem.currentTime = 0;
		this.#audioPlay( false );
		this.$elements.$stopBtn.$disabled( true );
	}

	// .........................................................................
	#onclick( e ) {
		switch ( $.$dataProp( e.target ) ) {
			case "play": this.#clickPlay(); break;
			case "stop": this.#audioStop(); break;
			case "rename": this.#clickRename(); break;
			case "delete": this.#clickDelete(); break;
			case "download": this.#clickDownload(); break;
		}
		this.$this.$focus();
	}
	#clickPlay() {
		!this.#audioElem
			? this.#initAudio()
			: this.#audioPlay( this.#audioElem.paused );
	}
	#clickRename() {
		this.$elements.$renameBtn.$addAttr( "loading" );
		return $popup.$prompt( GSTX.$samplesMvSample, "", this.$this.$getAttr( "name" ) )
			.then( name => {
				if ( !name || name === this.$this.$getAttr( "name" ) ) {
					throw "";
				}
				return name;
			} )
			.then( name => gsapiClient.$renameSample( this.$this.$dataId(), name ) )
			.then( name => this.$this.$setAttr( "name", name ) )
			.finally( () => this.$elements.$renameBtn.$rmAttr( "loading" ) );
	}
	#clickDownload() {
		const [ id, name, format ] = this.$this.$getAttr( "data-id", "name", "format" );

		GSUdownloadURL( `${ name }.${ format }`, `${ GSURL.$gsSmps }/${ id }.${ format }` );
	}
	#clickDelete() {
		this.$elements.$deleteBtn.$addAttr( "loading" );
		gsapiClient.$deleteSample( this.$this.$dataId() )
			.then( () => {
				this.$this.$setAttr( "size", 0 ).$dispatch( GSCO_SAMPLEGROUP_LISTCHANGE ).$remove();
			} )
			.finally( () => this.$elements.$deleteBtn.$rmAttr( "loading" ) );
	}
}

$.$define( "gsco-sample", gscoSample );
