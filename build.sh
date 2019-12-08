#!/bin/bash

declare -a HEADER=(
	'<!DOCTYPE html>'
	'<html lang="en">'
	'<head>'
	'<title>GridSound</title>'
	'<meta charset="UTF-8"/>'
	'<meta name="viewport" content="width=device-width, user-scalable=no"/>'
	'<link rel="shortcut icon" href="../assets/favicon.png"/>'
)

declare -a HEADEREND=(
	'</head>'
	'<body>'
)

declare -a CSSfiles=(
	"../assets/fonts/fonts.css"

	"gs-ui-components/gsuiIcon/gsuiIcon.css"

	"css/btn.css"
	"css/form.css"
	"css/rippleEffect.css"
	"css/root.css"
	"css/reset.css"
	"css/cmp.css"
	"css/main.css"
	"css/head.css"
	"css/footer.css"
	"css/pageSection.css"
	"css/homePage.css"
	"css/authPages.css"
	"css/userPage.css"
)

declare -a HTMLfiles=(
	"html/_main.html"
	"html/cmp.html"
	"html/authPage.html"
	"html/homePage.html"
	"html/userPage.html"
	"html/resetpassPage.html"
	"html/forgotpassPage.html"
)

declare -a JSfiles=(
	"gs-data/gsdata/gsdata.js"
	"gs-data/gsdataClock/gsdataClock.js"
	"gs-data/gsdataSynth/gsdataSynth.js"
	"gs-data/gsdataSynth/gsdataSynth.actions.js"
	"gs-data/gsdataLFO/gsdataLFO.js"
	"gs-data/gsdataLFO/gsdataLFO.actions.js"
	"gs-data/gsdataOscillator/gsdataOscillator.js"
	"gs-data/gsdataOscillator/gsdataOscillator.actions.js"
	"gs-data/gsdataMixer/gsdataMixer.js"
	"gs-data/gsdataMixer/gsdataMixer.actions.js"
	"gs-data/gsdataEffects/gsdataEffects.js"
	"gs-data/gsdataEffects/gsdataEffects.actions.js"
	"gs-data/gsdataFxFilter/gsdataFxFilter.js"
	"gs-data/gsdataFxFilter/gsdataFxFilter.actions.js"

	"daw-core/src/DAWCore.js"
	"daw-core/src/DAWCore.prototype.get.js"
	"daw-core/src/Buffers.js"
	"daw-core/src/LocalStorage.js"
	"daw-core/src/Destination.js"
	"daw-core/src/History.js"
	"daw-core/src/History.prototype.nameAction.js"
	"daw-core/src/Pianoroll.js"
	"daw-core/src/Composition.js"
	"daw-core/src/Composition.epure.js"
	"daw-core/src/Composition.format.js"
	"daw-core/src/Composition.prototype.change.js"
	"daw-core/src/json/composition.js"
	"daw-core/src/json/channels.js"
	"daw-core/src/json/channel.js"
	"daw-core/src/json/synth.js"
	"daw-core/src/json/lfo.js"
	"daw-core/src/utils/uuid.js"
	"daw-core/src/utils/time.js"
	"daw-core/src/utils/trim2.js"
	"daw-core/src/utils/uniqueName.js"
	"daw-core/src/utils/composeUndo.js"
	"daw-core/src/utils/castToNumber.js"
	"daw-core/src/actions/addCompositionsFromLocalStorage.js"
	"daw-core/src/actions/addNewComposition.js"
	"daw-core/src/actions/addComposition.js"
	"daw-core/src/actions/addCompositionByJSON.js"
	"daw-core/src/actions/addCompositionByBlob.js"
	"daw-core/src/actions/addCompositionByURL.js"
	"daw-core/src/actions/abortWAVExport.js"
	"daw-core/src/actions/dropAudioFiles.js"
	"daw-core/src/actions/liveChangeSynth.js"
	"daw-core/src/actions/liveChangeEffect.js"
	"daw-core/src/actions/liveChangeChannel.js"
	"daw-core/src/actions/exportCompositionToWAV.js"
	"daw-core/src/actions/exportCompositionToJSON.js"
	"daw-core/src/actions/changePatternSynth.js"
	"daw-core/src/actions/changePatternKeys.js"
	"daw-core/src/actions/deleteComposition.js"
	"daw-core/src/actions/closeComposition.js"
	"daw-core/src/actions/nameComposition.js"
	"daw-core/src/actions/openComposition.js"
	"daw-core/src/actions/saveComposition.js"
	"daw-core/src/actions/changeChannels.js"
	"daw-core/src/actions/newComposition.js"
	"daw-core/src/actions/changeEffects.js"
	"daw-core/src/actions/removePattern.js"
	"daw-core/src/actions/clonePattern.js"
	"daw-core/src/actions/changeSynth.js"
	"daw-core/src/actions/changeTempo.js"
	"daw-core/src/actions/removeSynth.js"
	"daw-core/src/actions/openPattern.js"
	"daw-core/src/actions/namePattern.js"
	"daw-core/src/actions/newPattern.js"
	"daw-core/src/actions/openSynth.js"
	"daw-core/src/actions/nameSynth.js"
	"daw-core/src/actions/newSynth.js"

	"gs-webaudio-library/gswaLFO/gswaLFO.js"
	"gs-webaudio-library/gswaMixer/gswaMixer.js"
	"gs-webaudio-library/gswaSynth/gswaSynth.js"
	"gs-webaudio-library/gswaSynth/gswaSynth.midiKeyToHz.js"
	"gs-webaudio-library/gswaBPMTap/gswaBPMTap.js"
	"gs-webaudio-library/gswaEffects/gswaEffects.js"
	"gs-webaudio-library/gswaFxFilter/gswaFxFilter.js"
	"gs-webaudio-library/gswaScheduler/gswaScheduler.js"
	"gs-webaudio-library/gswaEncodeWAV/gswaEncodeWAV.js"
	"gs-webaudio-library/gswaStereoPanner/gswaStereoPanner.js"
	"gs-webaudio-library/gswaPeriodicWaves/gswaPeriodicWaves.js"
	"gs-webaudio-library/gswaPeriodicWaves/gswaPeriodicWaves.list.js"

	"gs-api-client/gsapiClient.js"

	"js/common/rippleEffect.js"
	"js/cmp.js"
	"js/main.js"
	"js/authPage.js"
	"js/userPage.js"
	"js/resetpassPage.js"
	"js/forgotpassPage.js"
	"js/run.js"
)

buildDev() {
	filename='index.html'
	echo "Build $filename"
	printf '%s\n' "${HEADER[@]}" > $filename;
	printf '<link rel="stylesheet" href="%s"/>\n' "${CSSfiles[@]}" >> $filename;
	printf '%s\n' "${HEADEREND[@]}" >> $filename;
	cat "${HTMLfiles[@]}" >> $filename
	echo '<script>function lg( a ) { return console.log.apply( console, arguments ), a; }</script>' >> $filename
	printf '<script src="%s"></script>\n' "${JSfiles[@]}" >> $filename;
	echo '</body>' >> $filename
	echo '</html>' >> $filename
}

buildProd() {
	filename='index-prod.html'
	echo "Build $filename"
	printf '%s\n' "${HEADER[@]}" > $filename;
	echo '<style>' >> $filename
	cat "${CSSfiles[@]}" >> $filename
	echo '</style>' >> $filename
	printf '%s\n' "${HEADEREND[@]}" >> $filename;
	cat "${HTMLfiles[@]}" >> $filename
	echo '<script>' >> $filename
	echo '"use strict";' >> $filename
	echo 'function lg( a ) { return console.log.apply( console, arguments ), a; }' >> $filename
	cat "${JSfiles[@]}" | grep -v '"use strict";' >> $filename
	echo '</script>' >> $filename
	echo '</body>' >> $filename
	echo '</html>' >> $filename
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
