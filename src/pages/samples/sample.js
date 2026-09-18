"use strict";

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
		this.$this.$on( {
			click: this.#onclick.bind( this ),
			dblclick: this.#dblclick.bind( this ),
		} );
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
	#dblclick( e ) {
		if ( $.$tag( e.target ) === "gsco-sample-name" ) {
			this.#clickRename();
		}
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
