"use strict";

class homePage {
	#ctx = null;
	#waSynth = null;
	#waReverb = null;
	#startedKey = null;
	#setAnimSpeedThr = GSUthrottle( ( speed, amp ) => {
		GSUdomStyle( DOM[ "homePage-trySynth-joystick" ], {
			'--gsuiJoystick-anim-speed': speed,
			'--gsuiJoystick-anim-opacity': amp / 1,
		} );
	}, .2 );

	constructor() {
		Object.seal( this );
		GSUdomListen( DOM[ "homePage-trySynth-joystick" ], {
			[ GSEV_JOYSTICK_END ]: () => this.#onendJoystick(),
			[ GSEV_JOYSTICK_MOVE ]: ( _, x, y ) => this.#onmoveJoystick( x, y ),
			[ GSEV_JOYSTICK_START ]: ( _, x, y ) => {
				if ( this.#ctx ) {
					this.#onstartJoystick( x, y );
				} else {
					this.#audioInit().then( () => this.#onstartJoystick( x, y ) );
				}
			},
		} );
	}

	// .........................................................................
	$show() {
		GSUsetTimeout( () => {
			GSUdomAddClass( DOM.homePage, "startAnim" );
			GSUsetTimeout( () => GSUdomAddClass( DOM.homePage, "loopAnim" ), 1 );
		}, .05 );
	}
	$quit() {
		GSUdomRmClass( DOM.homePage, "startAnim", "loopAnim" );
	}

	// .........................................................................
	#onendJoystick() {
		this.#waSynth.$stopAllKeys();
		this.#startedKey = null;
	}
	#onstartJoystick( x, y ) {
		this.#startedKey = this.#waSynth.$startKey( [
			[ null, GSUgetModel( "key", { key: 2 * 12 + 8 } ) ],
		], this.#ctx.currentTime, 0, Infinity );
		this.#onmoveJoystick( x, y );
	}
	#onmoveJoystick( x, y ) {
		const lfoSpeed = 1 + GSUmathEaseInCirc( x ) * 63;
		const lfoAmp = .2 + y * .8;
		const waKey = this.#waSynth.$getKeyNode( this.#startedKey );

		GSUforEach( waKey.$oscNodes.get( "0" ).uniNodes, osc => {
			osc[ 0 ].$setWavetableAtTime( 1 - x, this.#ctx.currentTime );
		} );
		this.#setAnimSpeedThr( lfoSpeed, lfoAmp );
		this.#waSynth.$change( {
			lfos: {
				gain: {
					amp: lfoAmp,
					speed: lfoSpeed,
				},
			},
			oscillators: {
				0: {
					pan: ( x * 2 - 1 ) * .5,
					unisondetune: y * .5,
					unisonblend: .5 - x * .5,
					gain: .9,
				},
				1: {
					pan: ( x * 2 - 1 ) * -.5,
					unisondetune: ( 1 - y * .2 ),
					unisonblend: 1 - x * .9,
					gain: .5,
				},
			},
		} );
		this.#waReverb.$change( {
			// wet: .5 + ( 1 - y ) * 3.5,
			wet: 4,
		} );
	}

	// .........................................................................
	#audioInit() {
		this.#ctx = GSUaudioContext();
		return gswaCrossfade.$loadModule( this.#ctx ).then(() => {
			const wt = homePage.#createPulseWT();

			// gswaPeriodicWaves.$loadWaves( gswaPeriodicWavesList );
			gswaPeriodicWaves.$addWavetable( "custom.s0.o0", wt.waves );
			this.#waSynth = new gswaSynth();
			this.#waReverb = new gswaFxReverb();
			this.#waReverb.$setContext( this.#ctx );
			this.#waReverb.$getOutput().connect( this.#ctx.destination );
			this.#waSynth.$setContext( this.#ctx );
			this.#waSynth.$setBPM( 60 );
			this.#waSynth.$output.connect( this.#waReverb.$getInput() );
			this.#waSynth.$change( {
				envs: {
					gain: {
						toggle: true,
						attack: .01,
						hold: 0,
						decay: .1,
						sustain: .6,
						release: .5,
					},
					lowpass: {
						toggle: true,
						attack: 0,
						hold: 1,
						decay: 1,
						sustain: 1,
						release: .25,
						q: 5,
					},
				},
				lfos: {
					gain: {
						toggle: true,
						attack: .01,
					},
				},
				oscillators: {
					0: GSUgetModel( "oscillator", {
						wave: "custom.s0.o0",
						unisonvoices: 5,
						wavetable: wt,
						gain: .9,
					} ),
					1: GSUgetModel( "oscillator", {
						wave: "sawtooth",
						unisonvoices: 3,
						detune: -12,
						gain: .6,
					} ),
				},
			} );
			this.#waReverb.$change( {
				dry: 1,
				wet: 2,
				delay: 0,
				fadein: 0,
				decay: .5,
			} );
			this.#waReverb.$toggle( true );
		} );
	}
	static #createPulseWT() {
		const sz = 2048;
		const nbSteps = 16;
		const szp = sz / 2 / nbSteps;

		return {
			waves: Object.fromEntries( GSUnewArray( nbSteps, i => [ i, {
				index: i / ( nbSteps - 1 ),
				curve: GSUnewArray( sz, j => j < szp * ( nbSteps - i ) ? 1 : -1 ),
			} ] ) ),
			wtposCurves: {
				0: {
					duration: 1,
					curve: {
						0: { x: 0, y: 0, type: null,    val: null },
						1: { x: 1, y: 1, type: "curve", val: 0 },
					},
				},
			},
		};
	}
}
