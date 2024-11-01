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
	cat "${JSfiles[@]}" >> allJS.js
	echo '<script>'
	terser allJS.js --compress --mangle --toplevel --mangle-props "regex='^[$]'"
	echo '</script>'
	rm allJS.js
}

declare -a CSSfiles=(
	"assets/fonts/fonts.css"

	"gs-ui-components/gsuiIcon/gsuiIcon.css"
	"gs-ui-components/gsuiActionMenu/gsuiActionMenu.css"
	"gs-ui-components/gsuiComPlayer/gsuiComPlayer.css"

	"css/btn.css"
	"css/form.css"
	"css/rippleEffect.css"
	"css/root.css"
	"css/reset.css"
	"css/main.css"
	"css/head.css"
	"css/footer.css"
	"css/pageSection.css"
	"css/homePage.css"
	"css/authPages.css"
	"css/userPage.css"
	"css/cmpPage.css"
	"css/userAvatar.css"
)

declare -a JSfiles=(
	"gs-utils/gs-utils.js"
	"gs-utils/gs-utils-dom.js"
	"gs-utils/gs-utils-json.js"
	"gs-utils/gs-utils-audio.js"
	"gs-utils/gs-utils-files.js"

	"gs-api-client/gsapiClient.js"

	"daw-core/src/json/composition.js"
	"daw-core/src/json/block.js"
	"daw-core/src/json/channel.js"
	"daw-core/src/json/channelMain.js"
	"daw-core/src/json/channels.js"
	"daw-core/src/json/drum.js"
	"daw-core/src/json/drumcut.js"
	"daw-core/src/json/drumrow.js"
	"daw-core/src/json/effects.delay.js"
	"daw-core/src/json/effects.filter.js"
	"daw-core/src/json/effects.waveshaper.js"
	"daw-core/src/json/env.js"
	"daw-core/src/json/key.js"
	"daw-core/src/json/lfo.js"
	"daw-core/src/json/oscillator.js"
	"daw-core/src/json/synth.js"
	"daw-core/src/json/track.js"

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
	"daw-core/src/actions/common/getNextIdOf.js"
	"daw-core/src/actions/common/getNextOrderOf.js"
	"daw-core/src/actions/common/patternOpenedByType.js"
	"daw-core/src/actions/common/toggleSolo.js"
	"daw-core/src/actions/common/updatePatternDuration.js"

	"gs-wa-components/gswaNoise/gswaNoise.js"
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

	"html/main.html.js"
	"html/cmpPage.html.js"
	"html/homePage.html.js"
	"html/userPage.html.js"
	"html/authPage.html.js"
	"html/forgotpassPage.html.js"
	"html/resetpassPage.html.js"
	"gs-ui-components/gsuiComPlayer/gsuiComPlayer.html.js"

	"gs-ui-components/gsui0ne/gsui0ne.js"
	"gs-ui-components/gsuiActionMenu/gsuiActionMenu.js"
	"gs-ui-components/gsuiActionMenu/getAbsPos.js"
	"gs-ui-components/gsuiComPlayer/gsuiComPlayer.js"

	"js/common/rippleEffect.js"
	"js/main.js"
	"js/authPage.js"
	"js/userPage.js"
	"js/userAvatar.js"
	"js/cmpPage.js"
	"js/resetpassPage.js"
	"js/forgotpassPage.js"
	"js/run.js"
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
