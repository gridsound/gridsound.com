"use strict";

class gscoSample extends gsui0ne {
	#currentTiming = false;
	#audioElem = null;
	#frameId = null;

	constructor() {
		const popId = GSUuuid();

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
						$.$elem( "gsco-sample-name", { class: "gsui-ellipsis" } ),
						$.$elem( "gsco-sample-format" ),
						$.$elem( "gsco-sample-info", null,
							$.$elem( "gsco-sample-duration" ),
							$.$elem( "gsco-sample-size" ),
						),
						$.$elem( "gsui-com-button", { "data-prop": "options", popovertarget: popId, icon: "ellipsis-v" } ),
					),
					$.$elem( "gsui-dropdown", { id: popId },
						$.$elem( "gsui-dropdown-option", { value: "rename",     icon: "pen",      name: GSTX.$rename               } ),
						$.$elem( "gsui-dropdown-option", { value: "download",   icon: "download", name: GSTX.$download             } ),
						$.$elem( "gsui-dropdown-option", { value: "convertmp3", icon: "file-mp3", name: GSTX.$convertToMP3         } ),
						$.$elem( "gsui-dropdown-option", { value: "clonemp3",   icon: "file-mp3", name: GSTX.$cloneToMP3           } ),
						$.$elem( "gsui-dropdown-option", { value: "delete",     icon: "trash",    name: GSTX.$delete, danger: true } ),
					),
					$.$elem( "gsco-sample-body", null,
						$.$elem( "gsco-sample-player", null,
							$.$elem( "svg", { viewBox: "0 -128 512 256", preserveAspectRatio: "none" },
								$.$elem( "g", null,
									$.$elem( "path" ),
									$.$elem( "path" ),
								),
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
				$waveL: "gsco-sample-body path:first-child",
				$waveR: "gsco-sample-body path:last-child",
				$playBtn: "[data-prop='play']",
				$stopBtn: "[data-prop='stop']",
				$menuBtn: "[data-prop='options']",
				$mp3Btns: "gsui-dropdown-option[value$='mp3']",
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
		this.$this.$listen( {
			[ GSEV_DROPDOWN_CLICK ]: d => {
				switch ( d.$args[ 0 ] ) {
					case "rename": this.#clickRename(); break;
					case "delete": this.#clickDelete(); break;
					case "download": this.#clickDownload(); break;
					case "clonemp3": this.#clickCloneMP3(); break;
					case "convertmp3": this.#clickConvertMP3(); break;
				}
				this.$this.$focus();
			},
		} );
		this.#setSlider( 0 );
	}

	// .........................................................................
	static get observedAttributes() {
		return [ "order", "name", "format", "size", "duration" ];
		// "hash", "playing"
	}
	$attributeChanged( prop, val ) {
		switch ( prop ) {
			case "order": this.$this.$css( "order", val ); break;
			case "name": this.$elements.$name.$text( val ); break;
			case "size": this.$elements.$infoSize.$text( `${ GSUmathFloatReadable( +val ).join( " " ) }${ GSTX.$unitByteB }` ); break;
			case "duration": this.$elements.$infoDur.$text( `${ val } ${ GSTX.$unitSecondSec }` ); break;
			case "format":
				this.$elements.$infoFormat.$text( val );
				this.$elements.$mp3Btns.$css( "display", val === "wav" ? "flex" : "none" );
				break;
		}
	}
	$onmessage( type, a, b ) {
		switch ( type ) {
			case "waves":
				this.#drawWaveform( this.$elements.$waveL, a );
				this.#drawWaveform( this.$elements.$waveR, b || a );
				break;
			case "pause": this.#audioPlay( false ); break;
			case "playToggle": this.$elements.$playBtn.$click(); break;
		}
	}

	// .........................................................................
	#drawWaveform( el, val ) {
		el.$setAttr( "d", `M${ val.replaceAll( ",", "L" ) }` );
	}
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
	#calcURL() {
		const [ hash, format ] = this.$this.$getAttr( "hash", "format" );

		return `${ GSURL.$gsSmps }/${ hash }.${ format }`;
	}
	#initAudio() {
		if ( !this.#audioElem ) {
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
					src: this.#calcURL(),
					loop: false,
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
		this.$elements.$menuBtn.$addAttr( "loading" );
		return $popup.$prompt( GSTX.$samplesMvSample, "", this.$this.$getAttr( "name" ) )
			.then( name => {
				if ( !name || name === this.$this.$getAttr( "name" ) ) {
					throw "";
				}
				return name;
			} )
			.then( name => gsapiClient.$renameSample( this.$this.$dataId(), name ) )
			.then( name => this.$this.$setAttr( "name", name ) )
			.finally( () => this.$elements.$menuBtn.$rmAttr( "loading" ) );
	}
	#clickDownload() {
		const [ name, format ] = this.$this.$getAttr( "name", "format" );

		GSUdownloadURL( `${ name }.${ format }`, this.#calcURL() );
	}
	#clickDelete() {
		this.$elements.$menuBtn.$addAttr( "loading" );
		gsapiClient.$deleteSample( this.$this.$dataId() )
			.then( () => this.$this.$setAttr( "size", 0 ).$dispatch( GSCO_SAMPLE_DELETED ).$remove() )
			.finally( () => this.$elements.$menuBtn.$rmAttr( "loading" ) );
	}
	#clickCloneMP3() {
		this.$this.$dispatch( GSCO_SAMPLE_CLONEMP3, this.$this.$dataId(), this.#calcURL() );
	}
	#clickConvertMP3() {
		this.$this.$dispatch( GSCO_SAMPLE_CONVERTMP3, this.$this.$dataId(), this.#calcURL() );
	}
}

$.$define( "gsco-sample", gscoSample );
