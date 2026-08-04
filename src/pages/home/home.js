"use strict";

class gscoHome {
	#ctx = null;
	#waSynth = null;
	#waReverb = null;
	#startedKey = null;
	#setAnimSpeedThr = GSUthrottle( ( speed, amp ) => {
		DOM[ "homePage-trySynth-joystick" ].$css( {
			"--gsuiJoystick-anim-speed": speed,
			"--gsuiJoystick-anim-opacity": amp / 1,
		} );
	}, .2 );

	constructor() {
		Object.seal( this );
		DOM[ "homePage-trySynth-joystick" ].$listen( {
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
			DOM.homePage.$addClass( "startAnim" );
			GSUsetTimeout( () => DOM.homePage.$addClass( "loopAnim" ), 1 );
		}, .05 );
	}
	$quit() {
		DOM.homePage.$rmClass( "startAnim", "loopAnim" );
	}

	// .........................................................................
	#onendJoystick() {
		this.#waSynth.$synStopAllKeys();
		this.#startedKey = null;
	}
	#onstartJoystick( x, y ) {
		this.#startedKey = this.#waSynth.$synStartKey( [
			[ null, GSUgetModel( "key", { key: 3 * 12 } ) ],
		], this.#ctx.currentTime, 0, Infinity );
		this.#onmoveJoystick( x, y );
	}
	#onmoveJoystick( x, y ) {
		const lfoSpeed = 1 + GSUmathEaseInCirc( x ) * 60;
		const lfoAmp = .2 + y * .8;
		// const waKey = this.#waSynth.$synGetKeyNode( this.#startedKey );

		// GSUforEach( waKey.$oscNodes.get( "0" ).uniNodes, osc => {
		// 	osc[ 0 ].$cancelWtpos();
		// 	osc[ 0 ].$setWtposAtTime( 1 - x, this.#ctx.currentTime );
		// } );
		this.#setAnimSpeedThr( lfoSpeed, lfoAmp );
		this.#waSynth?.$synChange( this.#ctx, {
			envs: {
				lowpass: {
					q: 4 - x * 4,
				},
				wtpos: {
					sustain: y,
				},
			},
			lfos: {
				lowpass: {
					amp: lfoAmp,
					speed: lfoSpeed * 1.0,
				},
				// pan: {
				// 	amp: lfoAmp,
				// 	speed: lfoSpeed * 1.5,
				// },
			},
			oscillators: {
				0: {
					// pan: ( x * 2 - 1 ) * .7,
					// unisondetune: y * .5,
					// unisonblend: .5 - x * .5,
					// gain: .9,
				},
				1: {
					// pan: ( x * 2 - 1 ) * -.7,
					// unisondetune: 1 - y * .2,
					// unisonblend: 1 - x * .9,
					// gain: .5,
				},
			},
		} );
		// this.#waReverb.$change( {
		// 	// wet: .5 + ( 1 - y ) * 3.5,
		// } );
	}

	// .........................................................................
	#audioInit() {
		this.#ctx = GSUaudioContext();
		return gswaOsc.$oscLoadModule( this.#ctx ).then( () => {
			const wt = gscoHome.#createPulseWT();
			const wt2 = Object.values( wt.waves ).sort( ( a, b ) => a.index - b.index ).map( w => w.curve );

			gswaBuffers.$sabSetWavetable( "custom.s0.o0", wt2 );
			this.#waSynth = new gswaSynth();
			this.#waReverb = new gswaFxReverb();
			this.#waReverb.$setContext( this.#ctx );
			this.#waReverb.$getOutput().connect( this.#ctx.destination );
			this.#waSynth.$synSetContext( this.#ctx );
			this.#waSynth.$synSetBPM( 60 );
			this.#waSynth.$output.connect( this.#waReverb.$getInput() );
			this.#waSynth.$synChange( this.#ctx, {
				envs: {
					gain: {
						toggle: true,
						attack: .01,
						hold: 0,
						decay: .1,
						sustain: .6,
						release: 2,
					},
					lowpass: {
						toggle: true,
						// attack: 0,
						// hold: 1,
						// decay: 1,
						sustain: .5,
						release: .5,
						q: 2,
					},
					wtpos: {
						toggle: true,
						attack: 0,
						hold: 0,
						decay: 0,
						sustain: 1,
						release: 9999,
					},
				},
				lfos: {
					lowpass: {
						toggle: true,
						// attack: .01,
						speed: 4,
						amp: .9,
					},
					// pan: {
					// 	toggle: true,
					// 	attack: .5,
					// 	speed: 1.5,
					// 	amp: 1,
					// },
				},
				oscillators: {
					0: GSUgetModel( "oscillator", {
						wave: "custom.s0.o0",
						// unisonvoices: 2,
						wavetable: wt,
						gain: .3,
					} ),
					1: GSUgetModel( "oscillator", {
						wave: "sine",
						// unisonvoices: 3,
						detune: -6,
						gain: .35,
					} ),
					2: GSUgetModel( "oscillator", {
						wave: "sine",
						// unisonvoices: 3,
						detune: -12,
						gain: .35,
					} ),
				},
			} );
			this.#waReverb.$change( {
				dry: 1,
				wet: 4,
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
		};
	}
}
