export default {
	title:         "GridSound",
	desc:          "The platform to compose your own music",
	favicon:       "assets/ico.svg",
	url:           "https://gridsound.com/",
	ogImage:       "https://gridsound.com/assets/og-image.jpg",
	ogImageW:      800,
	ogImageH:      400,
	// manifest:      "manifest.json",
	// serviceWorker: "serviceWorker.js",
	// .........................................................................
	cssSrcA: [
		"assets/fonts/fonts.css",
	],
	cssSrcB: [
		"src/components/gscomUserLink.css",

		// .....................................................................
		"src/main/form.css",
		"src/main/root.css",
		"src/main/reset.css",
		"src/main/main.css",
		"src/main/head.css",
		"src/main/footer.css",

		// .....................................................................
		"src/pages/home/home.css",
		"src/pages/auth/auth.css",
		"src/pages/cmp/cmp.css",
	],
	jsSrcB: [
		"src/components/gscomUserLink.js",

		// .....................................................................
		"src/main/main.html.js",
		"src/pages/cmp/cmp.html.js",
		"src/pages/home/home.html.js",
		"src/pages/user/user.html.js",
		"src/pages/auth/auth.html.js",
		"src/pages/forgotpass/forgotpass.html.js",
		"src/pages/resetpass/resetpass.html.js",

		// .....................................................................
		"src/main/main.js",

		// .....................................................................
		"src/pages/auth/auth.js",
		"src/pages/home/home.js",
		"src/pages/user/user.js",
		"src/pages/cmp/cmp.js",
		"src/pages/resetpass/resetpass.js",
		"src/pages/forgotpass/forgotpass.js",

		// .....................................................................
		"src/run.js",
	],
	// .........................................................................
	cssDep: [
		"gs-ui-components/gsui.css",
		"gs-ui-components/gsui-gray.css",
		"gs-ui-components/gsui-flex.css",
		"gs-ui-components/gsuiIcon/gsuiIcon.css",
		"gs-ui-components/gsuiRipple/gsuiRipple.css",
		"gs-ui-components/gsuiDropdown/gsuiDropdown.css",
		"gs-ui-components/gsuiActionMenu/gsuiActionMenu.css",
		"gs-ui-components/gsuiComAvatar/gsuiComAvatar.css",
		"gs-ui-components/gsuiComButton/gsuiComButton.css",
		"gs-ui-components/gsuiComProfile/gsuiComProfile.css",
		"gs-ui-components/gsuiComPlayer/gsuiComPlayer.css",
		"gs-ui-components/gsuiComPlaylist/gsuiComPlaylist.css",
		"gs-ui-components/gsuiJoystick/gsuiJoystick.css",
		"gs-ui-components/gsuiPopup/gsuiPopup.css",
	],
	// .........................................................................
	jsDep: [
		"gs-ui-components/gsui-constantes.js",

		// .....................................................................
		"gs-utils/gs-utils.js",
		"gs-utils/gs-utils-dom.js",
		"gs-utils/gs-utils-func.js",
		"gs-utils/gs-utils-math.js",
		"gs-utils/gs-utils-math-fft.js",
		"gs-utils/gs-utils-json.js",
		"gs-utils/gs-utils-audio.js",
		"gs-utils/gs-utils-audio-nodes.dev.js",
		"gs-utils/gs-utils-files.js",
		"gs-utils/gs-utils-models.js",
		"gs-utils/gs-utils-checkType.dev.js",

		// .....................................................................
		"gs-api-client/gsapiClient.js",

		// .....................................................................
		"gs-wa-components/gswaNoise/gswaNoise.js",
		"gs-wa-components/gswaReverbIR/gswaReverbIR.js",
		"gs-wa-components/gswaCrossfade/gswaCrossfade.js",
		"gs-wa-components/gswaOscillator/gswaOscillator.js",
		"gs-wa-components/gswaLFO/gswaLFO.js",
		"gs-wa-components/gswaEnvelope/gswaEnvelope.js",
		"gs-wa-components/gswaMixer/gswaMixer.js",
		"gs-wa-components/gswaSynth/gswaSynth.js",
		"gs-wa-components/gswaKeysScheduler/gswaKeysScheduler.js",
		"gs-wa-components/gswaDrumsScheduler/gswaDrumsScheduler.js",
		"gs-wa-components/gswaSlicer/gswaSlicer.js",
		"gs-wa-components/gswaBPMTap/gswaBPMTap.js",
		"gs-wa-components/gswaEffects/gswaEffects.js",
		"gs-wa-components/gswaFxDelay/gswaFxDelay.js",
		"gs-wa-components/gswaFxFilter/gswaFxFilter.js",
		"gs-wa-components/gswaFxReverb/gswaFxReverb.js",
		"gs-wa-components/gswaFxWaveShaper/gswaFxWaveShaper.js",
		"gs-wa-components/gswaDrumrows/gswaDrumrows.js",
		"gs-wa-components/gswaScheduler/gswaScheduler.js",
		"gs-wa-components/gswaEncodeWAV/gswaEncodeWAV.js",
		"gs-wa-components/gswaStereoPanner/gswaStereoPanner.js",
		"gs-wa-components/gswaPeriodicWaves/gswaPeriodicWaves.js",
		"gs-wa-components/gswaMIDIParser/gswaMIDIParser.js",
		"gs-wa-components/gswaMIDIParser/gswaMIDIToKeys.js",
		"gs-wa-components/gswaMIDIDevices/gswaMIDIDevices.js",
		"gs-wa-components/gswaMIDIDevices/gswaMIDIInput.js",
		"gs-wa-components/gswaMIDIDevices/gswaMIDIOutput.js",

		// .....................................................................
		"gs-ui-components/gsuiComProfile/gsuiComProfile.html.js",
		"gs-ui-components/gsuiComPlayer/gsuiComPlayer.html.js",
		"gs-ui-components/gsuiComPlaylist/gsuiComPlaylist.html.js",
		"gs-ui-components/gsuiPopup/gsuiPopup.html.js",

		// .....................................................................
		"gs-ui-components/gsui0ne/gsui0ne.js",
		"gs-ui-components/gsuiRipple/gsuiRipple.js",
		"gs-ui-components/gsuiDropdown/getAbsPos.js",
		"gs-ui-components/gsuiDropdown/gsuiDropdown.js",
		"gs-ui-components/gsuiActionMenu/gsuiActionMenu.js",
		"gs-ui-components/gsuiComAvatar/gsuiComAvatar.js",
		"gs-ui-components/gsuiComButton/gsuiComButton.js",
		"gs-ui-components/gsuiComProfile/gsuiComProfile.js",
		"gs-ui-components/gsuiComPlayer/gsuiComPlayer.js",
		"gs-ui-components/gsuiComPlaylist/gsuiComPlaylist.js",
		"gs-ui-components/gsuiJoystick/gsuiJoystick.js",
		"gs-ui-components/gsuiPopup/gsuiPopup.js",
	],
};
