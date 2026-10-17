"use strict";

class gscoSample extends gsui0ne {
	#currentTiming = false;
	#frameId = null;
	#bufEdit = $noop;
	#bufPlayer = null;
	#loadedOnce = false;
	#intervalId = null;

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
						$.$elem( "gsui-buttons", null,
							$.$elem( "gsui-button", { "data-prop": "play", icon: "play", model: "submit" } ),
							$.$elem( "gsui-button", { "data-prop": "stop", icon: "stop", model: "submit", disabled: true } ),
						),
						$.$elem( "gsco-sample-name", { class: "gsui-ellipsis" } ),
						$.$elem( "gsco-sample-format" ),
						$.$elem( "gsco-sample-info", null,
							$.$elem( "gsco-sample-duration" ),
							$.$elem( "gsco-sample-size" ),
						),
						$.$elem( "gsui-button", { "data-prop": "options", popovertarget: popId, icon: "ellipsis-v" } ),
					),
					$.$elem( "gsui-dropdown", { id: popId, clicknclose: true },
						$.$elem( "gsui-dropdown-option", { value: "rename",     icon: "pen",         name: GSTX.$rename               } ),
						$.$elem( "gsui-dropdown-option", { value: "edit",       icon: "square-dash", name: GSTX.$editTrim             } ),
						$.$elem( "gsui-dropdown-option", { value: "download",   icon: "download",    name: GSTX.$download             } ),
						$.$elem( "gsui-dropdown-option", { value: "convertmp3", icon: "file-mp3",    name: GSTX.$convertToMP3         } ),
						$.$elem( "gsui-dropdown-option", { value: "clonemp3",   icon: "file-mp3",    name: GSTX.$cloneToMP3           } ),
						$.$elem( "gsui-dropdown-option", { value: "delete",     icon: "trash",       name: GSTX.$delete, danger: true } ),
					),
					$.$elem( "gsco-sample-body", null,
						$.$elem( "gsco-sample-player", null,
							$.$elem( "gsui-waveform", { res: "512 256" } ),
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
				$playBtn: "[data-prop='play']",
				$stopBtn: "[data-prop='stop']",
				$menuBtn: "[data-prop='options']",
				$mp3Btns: "gsui-dropdown-option[value$='mp3']",
				$body: "gsco-sample-body",
				$waveform: "gsui-waveform",
				$editOpt: "gsui-dropdown-option[value='edit']",
			},
		} );
		this.$this.$on( {
			click: this.#onclick.bind( this ),
			dblclick: this.#dblclick.bind( this ),
		} );
		this.$elements.$slider.$on( {
			dragstart: e => e.preventDefault(),
			pointerdown: this.#sliderPtrDown.bind( this ),
			pointermove: this.#sliderPtrMove.bind( this ),
			pointerup: this.#sliderPtrUp.bind( this ),
		} );
		this.$this.$listen( {
			[ GSEV_BUFFEREDITOR_EXIT ]: () => {
				this.$this.$rmAttr( "editing" );
			},
			[ GSEV_DROPDOWN_CLICK ]: d => {
				switch ( d.$args[ 0 ] ) {
					case "edit": this.#clickEdit(); break;
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
		return [ "hash", "order", "name", "format", "size", "duration", "editing" ];
		// "playing"
	}
	$attributeChanged( prop, val ) {
		switch ( prop ) {
			case "editing": this.#setEditing( val === "" ); break;
			case "order": this.$this.$css( "order", val ); break;
			case "name": this.$elements.$name.$text( val ); break;
			case "size": this.$elements.$infoSize.$text( `${ GSUmathFloatReadable( +val ).join( " " ) }${ GSTX.$unitByteB }` ); break;
			case "duration": this.$elements.$infoDur.$text( `${ val } ${ GSTX.$unitSecondSec }` ); break;
			case "format":
				this.$elements.$infoFormat.$text( val );
				this.$elements.$mp3Btns.$css( "display", val === "wav" ? "flex" : "none" );
			case "hash": this.#bufPlayer && this.#initAudio(); break;
		}
	}
	$onmessage( type, val ) {
		switch ( type ) {
			case "waves": this.$elements.$waveform.$message( GSEV_WAVEFORM_DRAW, val ); break;
			case "pause": this.#audioStop(); break;
			case "playToggle": this.#clickPlay(); break;
		}
	}

	// .........................................................................
	#setEditing( b ) {
		this.$elements.$editOpt.$disabled( b );
		if ( !b ) {
			this.#bufEdit.$remove();
			this.#bufEdit = $noop;
		} else {
			this.#bufEdit = $( "<gsui-buffer-editor>" ).$appendTo( this.$elements.$body );
			this.#getAudioBuffer()
				.then( buf => GSUwait( .2 ).then( () => buf ) )
				.then( buf => this.#bufEdit.$message( GSEV_BUFFEREDITOR_BUFFER, buf ) )
				.finally( () => this.$elements.$menuBtn.$rmAttr( "loading" ) );
		}
	}
	#sliderPtrDown( e ) {
		this.$elements.$slider.$setPtrCapture( e.pointerId );
		this.#currentTiming = true;
		this.#sliderPtrMove( e );
	}
	#sliderPtrMove( e ) {
		if ( this.#currentTiming ) {
			this.#setSlider( this.#getSliderVal( e.pageX ) );
		}
	}
	#sliderPtrUp( e ) {
		this.$elements.$slider.$relPtrCapture( e.pointerId );
		this.#currentTiming = false;
		if ( this.#bufPlayer ) {
			this.#bufPlayer.$bfplTime( this.#getSliderVal( e.pageX ) );
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
	#getAudioBuffer() {
		return fetch( this.#calcURL() )
			.then( res => res.arrayBuffer() )
			.then( arr => GSUaudioCurrentContext.decodeAudioData( arr ) );
	}
	#initAudio() {
		const btn = this.$elements.$playBtn;

		btn.$addAttr( "loading" );
		return GSUaudioCurrentContext.resume()
			.then( () => gswaBufferPlayer.$bfplLoadModule( GSUaudioCurrentContext ) )
			.then( () => this.#getAudioBuffer() )
			.then( buf => {
				gswaBuffers.$sabSetBuffer( this.$this.$dataId(), buf );
				if ( !this.#bufPlayer ) {
					this.#bufPlayer = new gswaBufferPlayer( GSUaudioCurrentContext );
					this.#bufPlayer.$bfplLoop( true );
					this.#bufPlayer.$bfplConnect( GSUaudioCurrentContext.destination );
				}
				this.#bufPlayer.$bfplSource( ...gswaBuffers.$sabGetBuffer( this.$this.$dataId() ) );
			} )
			.finally( () => btn.$rmAttr( "loading" ) );
	}
	#audioPlay( b ) {
		if ( b ) {
			$( "gsco-sample[playing]" ).$message( "pause" );
			this.#intervalId = GSUsetInterval( () => {
				lg("loop")
				if ( !this.#currentTiming ) {
					this.#setSlider( this.#bufPlayer.$bfplTime() );
				}
			}, 1 / 60 );
			this.$elements.$stopBtn.$disabled( false );
		} else {
			GSUclearInterval( this.#intervalId );
			this.#intervalId = null;
		}
		GSUaudioParamSet( this.#bufPlayer.$play, +b );
		GSUaudioParamSet( this.#bufPlayer.$speed, 1 );
		this.$this.$setAttr( "playing", b );
		this.$elements.$playBtn.$setAttr( "icon", b ? "pause" : "play" );
	}
	#audioStop() {
		this.#audioPlay( false );
		this.#bufPlayer.$bfplTime( 0 );
		this.#setSlider( 0 );
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
		!this.#bufPlayer
			? this.#initAudio().then( () => this.#audioPlay( true ) )
			: this.#audioPlay( !this.#intervalId );
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
	#clickEdit() {
		this.$elements.$menuBtn.$addAttr( "loading" );
		this.$this.$addAttr( "editing" );
	}
}

$.$define( "gsco-sample", gscoSample );
