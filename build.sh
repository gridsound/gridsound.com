#!/bin/bash

writeHeader() {
	echo '<!DOCTYPE html>'
	echo '<html lang="en">'
	echo '<head>'
	echo '<title>GridSound</title>'
	echo '<meta charset="utf-8"/>'
	echo '<meta name="viewport" content="width=device-width, user-scalable=no"/>'
	echo '<meta name="description" content="A free and Open-Source DAW (digital audio workstation)"/>'
	echo '<meta name="google" content="notranslate"/>'
	echo '<meta name="theme-color" content="#1b1b31"/>'
	echo '<meta property="og:type" content="website"/>'
	echo '<meta property="og:title" content="GridSound"/>'
	echo '<meta property="og:url" content="https://gridsound.com/"/>'
	echo '<meta property="og:image" content="https://gridsound.com/assets/og-image.jpg"/>'
	echo '<meta property="og:image:width" content="800"/>'
	echo '<meta property="og:image:height" content="400"/>'
	echo '<meta property="og:description" content="an online digital audio workstation"/>'
	echo '<link rel="shortcut icon" href="assets/favicon.png"/>'
}
writeBody() {
	echo '</head>'
	echo '<body>'
	echo '<noscript>GridSound needs JavaScript to run</noscript>'
}
writeEnd() {
	echo '</body>'
	echo '</html>'
}
writeCSS() {
	printf '<link rel="stylesheet" href="%s"/>\n' "${CSSfiles[@]}"
}
writeJS() {
	printf '<script src="%s"></script>\n' "${JSfiles[@]}"
}
writeCSScompress() {
	echo -n '' > allCSS.css
	cat "${CSSfiles[@]}" >> allCSS.css
	echo '<style>'
	csso allCSS.css
	echo '</style>'
	rm allCSS.css
}
writeJScompress() {
	echo '"use strict";' > allJS.js
	cat `echo "${JSfiles[@]}" | sed 's/.dev.js/.prod.js/g'` >> allJS.js
	echo '<script>'
	terser allJS.js --compress --mangle --toplevel --mangle-props "regex='^[$]'"
	echo '</script>'
	rm allJS.js
}

declare -a CSSfiles=(
	"assets/fonts/fonts.css"

	"gs-ui-components/gsui.css"
	"gs-ui-components/gsuiIcon/gsuiIcon.css"
	"gs-ui-components/gsuiRipple/gsuiRipple.css"
	"gs-ui-components/gsuiDropdown/gsuiDropdown.css"
	"gs-ui-components/gsuiActionMenu/gsuiActionMenu.css"
	"gs-ui-components/gsuiComAvatar/gsuiComAvatar.css"
	"gs-ui-components/gsuiComButton/gsuiComButton.css"
	"gs-ui-components/gsuiComProfile/gsuiComProfile.css"
	"gs-ui-components/gsuiComPlayer/gsuiComPlayer.css"
	"gs-ui-components/gsuiComPlaylist/gsuiComPlaylist.css"
	"gs-ui-components/gsuiPopup/gsuiPopup.css"

	"src/css/form.css"
	"src/css/root.css"
	"src/css/reset.css"
	"src/css/main.css"
	"src/css/head.css"
	"src/css/footer.css"
	"src/css/homePage.css"
	"src/css/authPages.css"
	"src/css/cmpPage.css"
)

declare -a JSfiles=(
	"gs-utils/gs-utils.js"
	"gs-utils/gs-utils-dom.js"
	"gs-utils/gs-utils-func.js"
	"gs-utils/gs-utils-math.js"
	"gs-utils/gs-utils-math-fft.js"
	"gs-utils/gs-utils-json.js"
	"gs-utils/gs-utils-audio.js"
	"gs-utils/gs-utils-audio-nodes.dev.js"
	"gs-utils/gs-utils-files.js"
	"gs-utils/gs-utils-models.js"
	"gs-utils/gs-utils-checkType.dev.js"

	"gs-api-client/gsapiClient.js"

	"daw-core/src/DAWCore.js"
	"daw-core/src/DAWCoreBuffers.js"
	"daw-core/src/DAWCoreCompositionExportWAV.js"
	"daw-core/src/DAWCoreCompositionFormat.js"
	"daw-core/src/DAWCoreDestination.js"
	"daw-core/src/DAWCoreHistory.js"
	"daw-core/src/DAWCoreHistoryTexts.js"
	"daw-core/src/DAWCoreSlicesBuffers.js"
	"daw-core/src/DAWCoreComposition.js"
	"daw-core/src/DAWCoreSlices.js"
	"daw-core/src/DAWCoreDrums.js"
	"daw-core/src/DAWCoreKeys.js"

	"daw-core/src/controllers/blocks.js"
	"daw-core/src/controllers/drumrows.js"
	"daw-core/src/controllers/drums.js"
	"daw-core/src/controllers/effects.js"
	"daw-core/src/controllers/keys.js"
	"daw-core/src/controllers/mixer.js"
	"daw-core/src/controllers/synth.js"
	"daw-core/src/controllers/tracks.js"
	"daw-core/src/controllers/slicer.js"

	"daw-core/src/actions/common/addPatternBuffer.js"
	"daw-core/src/actions/common/calcNewDuration.js"
	"daw-core/src/actions/common/calcNewKeysDuration.js"
	"daw-core/src/actions/common/createUniqueName.js"
	"daw-core/src/actions/common/getDrumrowName.js"
	"daw-core/src/actions/common/patternOpenedByType.js"
	"daw-core/src/actions/common/toggleSolo.js"
	"daw-core/src/actions/common/updatePatternDuration.js"

	"gs-wa-components/gswaNoise/gswaNoise.js"
	"gs-wa-components/gswaReverbIR/gswaReverbIR.js"
	"gs-wa-components/gswaCrossfade/gswaCrossfade.js"
	"gs-wa-components/gswaOscillator/gswaOscillator.js"
	"gs-wa-components/gswaLFO/gswaLFO.js"
	"gs-wa-components/gswaEnvelope/gswaEnvelope.js"
	"gs-wa-components/gswaMixer/gswaMixer.js"
	"gs-wa-components/gswaSynth/gswaSynth.js"
	"gs-wa-components/gswaKeysScheduler/gswaKeysScheduler.js"
	"gs-wa-components/gswaDrumsScheduler/gswaDrumsScheduler.js"
	"gs-wa-components/gswaSlicer/gswaSlicer.js"
	"gs-wa-components/gswaBPMTap/gswaBPMTap.js"
	"gs-wa-components/gswaEffects/gswaEffects.js"
	"gs-wa-components/gswaFxDelay/gswaFxDelay.js"
	"gs-wa-components/gswaFxFilter/gswaFxFilter.js"
	"gs-wa-components/gswaFxReverb/gswaFxReverb.js"
	"gs-wa-components/gswaFxWaveShaper/gswaFxWaveShaper.js"
	"gs-wa-components/gswaDrumrows/gswaDrumrows.js"
	"gs-wa-components/gswaScheduler/gswaScheduler.js"
	"gs-wa-components/gswaEncodeWAV/gswaEncodeWAV.js"
	"gs-wa-components/gswaStereoPanner/gswaStereoPanner.js"
	"gs-wa-components/gswaPeriodicWaves/gswaPeriodicWaves.js"
	"gs-wa-components/gswaMIDIParser/gswaMIDIParser.js"
	"gs-wa-components/gswaMIDIParser/gswaMIDIToKeys.js"
	"gs-wa-components/gswaMIDIDevices/gswaMIDIDevices.js"
	"gs-wa-components/gswaMIDIDevices/gswaMIDIInput.js"
	"gs-wa-components/gswaMIDIDevices/gswaMIDIOutput.js"

	"src/html/main.html.js"
	"src/html/cmpPage.html.js"
	"src/html/homePage.html.js"
	"src/html/userPage.html.js"
	"src/html/authPage.html.js"
	"src/html/forgotpassPage.html.js"
	"src/html/resetpassPage.html.js"
	"gs-ui-components/gsuiComProfile/gsuiComProfile.html.js"
	"gs-ui-components/gsuiComPlayer/gsuiComPlayer.html.js"
	"gs-ui-components/gsuiComPlaylist/gsuiComPlaylist.html.js"
	"gs-ui-components/gsuiPopup/gsuiPopup.html.js"

	"gs-ui-components/gsui0ne/gsui0ne.js"
	"gs-ui-components/gsuiRipple/gsuiRipple.js"
	"gs-ui-components/gsuiDropdown/getAbsPos.js"
	"gs-ui-components/gsuiDropdown/gsuiDropdown.js"
	"gs-ui-components/gsuiActionMenu/gsuiActionMenu.js"
	"gs-ui-components/gsuiComAvatar/gsuiComAvatar.js"
	"gs-ui-components/gsuiComButton/gsuiComButton.js"
	"gs-ui-components/gsuiComProfile/gsuiComProfile.js"
	"gs-ui-components/gsuiComPlayer/gsuiComPlayer.js"
	"gs-ui-components/gsuiComPlaylist/gsuiComPlaylist.js"
	"gs-ui-components/gsuiPopup/gsuiPopup.js"

	"src/js/main.js"
	"src/js/authPage.js"
	"src/js/homePage.js"
	"src/js/userPage.js"
	"src/js/cmpPage.js"
	"src/js/resetpassPage.js"
	"src/js/forgotpassPage.js"
	"src/js/run.js"
)

buildDev() {
	filename='index.html'
	echo "Build $filename"
	writeHeader > $filename
	writeCSS >> $filename
	writeBody >> $filename
	echo '<script>function lg( a ) { return console.log.apply( console, arguments ), a; }</script>' >> $filename
	writeJS >> $filename
	writeEnd >> $filename
}

buildProd() {
	filename='index-prod.html'
	echo "Build $filename"
	writeHeader > $filename
	writeCSScompress >> $filename
	writeBody >> $filename
	echo '<script>function lg(a){return a}</script>' >> $filename
	writeJScompress >> $filename
	writeEnd >> $filename
}

updateDep() {
	git submodule init
	git submodule update --remote
	cp gs-wa-components/gswaCrossfade/gswaCrossfadeProc.js .
}

if [ $# = 0 ]; then
	echo '          -------------------------------'
	echo '        .:: GridSound build shellscript ::.'
	echo '        -----------------------------------'
	echo ''
	echo './build.sh dev ---> create "index.html" for development'
	echo './build.sh prod --> create "index-prod.html" for production'
	echo './build.sh dep ---> update all the submodules'
elif [ $1 = "dep" ]; then
	updateDep
elif [ $1 = "dev" ]; then
	buildDev
elif [ $1 = "prod" ]; then
	buildProd
fi
