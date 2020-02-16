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
	"css/userAvatar.css"
)

declare -a HTMLfiles=(
	"html/_main.html"
	"html/cmp.html"
	"html/authPage.html"
	"html/homePage.html"
	"html/userPage.html"
	"html/cmpPage.html"
	"html/resetpassPage.html"
	"html/forgotpassPage.html"
)

declare -a JSfiles=(
	"gs-data/gsdata/gsdata.js"
	"gs-data/gsdataClock/gsdataClock.js"
	"gs-data/gsdataSynth/gsdataSynth.js"
	"gs-data/gsdataDrums/gsdataDrums.js"
	"gs-data/gsdataMixer/gsdataMixer.js"
	"gs-data/gsdataMixer/gsdataMixer.actions.js"
	"gs-data/gsdataEffects/gsdataEffects.js"
	"gs-data/gsdataEffects/gsdataEffects.actions.js"
	"gs-data/gsdataFxFilter/gsdataFxFilter.js"
	"gs-data/gsdataFxFilter/gsdataFxFilter.actions.js"
	"gs-data/gsdataDrumrows/gsdataDrumrows.js"

	"daw-core/src/DAWCore.js"
	"daw-core/src/Buffers.js"
	"daw-core/src/LocalStorage.js"
	"daw-core/src/Destination.js"
	"daw-core/src/History.js"
	"daw-core/src/History.prototype.nameAction.js"
	"daw-core/src/Drums.js"
	"daw-core/src/Pianoroll.js"
	"daw-core/src/Composition.js"
	"daw-core/src/Composition.epure.js"
	"daw-core/src/Composition.format.js"
	"daw-core/src/Composition.prototype.change.js"
	"daw-core/src/json/composition.js"
	"daw-core/src/json/channel.js"
	"daw-core/src/json/channels.js"
	"daw-core/src/json/synth.js"
	"daw-core/src/json/lfo.js"
	"daw-core/src/json/oscillator.js"

	"daw-core/src/utils/addIfNotEmpty.js"
	"daw-core/src/utils/capitalize.js"
	"daw-core/src/utils/castToNumber.js"
	"daw-core/src/utils/composeUndo.js"
	"daw-core/src/utils/deepAssign.js"
	"daw-core/src/utils/deepCopy.js"
	"daw-core/src/utils/deepFreeze.js"
	"daw-core/src/utils/diffAssign.js"
	"daw-core/src/utils/isntEmpty.js"
	"daw-core/src/utils/isObject.js"
	"daw-core/src/utils/jsonCopy.js"
	"daw-core/src/utils/time.js"
	"daw-core/src/utils/trim2.js"
	"daw-core/src/utils/uniqueName.js"
	"daw-core/src/utils/uuid.js"

	"daw-core/src/cmpActions/common/calcNewDuration.js"
	"daw-core/src/cmpActions/common/createUniqueName.js"
	"daw-core/src/cmpActions/common/getDrumrowName.js"
	"daw-core/src/cmpActions/common/getNextIdOf.js"
	"daw-core/src/cmpActions/common/getNextOrderOf.js"

	"daw-core/src/cmpActions/addDrumrow.js"
	"daw-core/src/cmpActions/addDrums.js"
	"daw-core/src/cmpActions/addOscillator.js"
	"daw-core/src/cmpActions/addPatternDrums.js"
	"daw-core/src/cmpActions/addPatternKeys.js"
	"daw-core/src/cmpActions/addSynth.js"
	"daw-core/src/cmpActions/changeChannels.js"
	"daw-core/src/cmpActions/changeDrumrow.js"
	"daw-core/src/cmpActions/changeDrumrowPattern.js"
	"daw-core/src/cmpActions/changeLFO.js"
	"daw-core/src/cmpActions/changeLoop.js"
	"daw-core/src/cmpActions/changeOscillator.js"
	"daw-core/src/cmpActions/changePatternKeys.js"
	"daw-core/src/cmpActions/changeTempo.js"
	"daw-core/src/cmpActions/clonePattern.js"
	"daw-core/src/cmpActions/redirectToChannel.js"
	"daw-core/src/cmpActions/removeDrumrow.js"
	"daw-core/src/cmpActions/removeDrums.js"
	"daw-core/src/cmpActions/removeOscillator.js"
	"daw-core/src/cmpActions/removePattern.js"
	"daw-core/src/cmpActions/removeSynth.js"
	"daw-core/src/cmpActions/renameComposition.js"
	"daw-core/src/cmpActions/renamePattern.js"
	"daw-core/src/cmpActions/renameSynth.js"
	"daw-core/src/cmpActions/reorderDrumrow.js"
	"daw-core/src/cmpActions/reorderOscillator.js"
	"daw-core/src/cmpActions/toggleDrumrow.js"
	"daw-core/src/cmpActions/toggleLFO.js"
	"daw-core/src/cmpActions/toggleOnlyDrumrow.js"

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
	"daw-core/src/actions/deleteComposition.js"
	"daw-core/src/actions/closeComposition.js"
	"daw-core/src/actions/openComposition.js"
	"daw-core/src/actions/saveComposition.js"
	"daw-core/src/actions/newComposition.js"
	"daw-core/src/actions/closePattern.js"
	"daw-core/src/actions/openPattern.js"
	"daw-core/src/actions/openSynth.js"

	"gs-wa-components/gswaLFO/gswaLFO.js"
	"gs-wa-components/gswaMixer/gswaMixer.js"
	"gs-wa-components/gswaSynth/gswaSynth.js"
	"gs-wa-components/gswaSynth/gswaSynth.midiKeyToHz.js"
	"gs-wa-components/gswaKeysScheduler/gswaKeysScheduler.js"
	"gs-wa-components/gswaDrumsScheduler/gswaDrumsScheduler.js"
	"gs-wa-components/gswaBPMTap/gswaBPMTap.js"
	"gs-wa-components/gswaEffects/gswaEffects.js"
	"gs-wa-components/gswaFxFilter/gswaFxFilter.js"
	"gs-wa-components/gswaDrumrows/gswaDrumrows.js"
	"gs-wa-components/gswaScheduler/gswaScheduler.js"
	"gs-wa-components/gswaEncodeWAV/gswaEncodeWAV.js"
	"gs-wa-components/gswaStereoPanner/gswaStereoPanner.js"
	"gs-wa-components/gswaPeriodicWaves/gswaPeriodicWaves.js"
	"gs-wa-components/gswaPeriodicWaves/gswaPeriodicWaves.list.js"

	"gs-api-client/gsapiClient.js"

	"js/common/rippleEffect.js"
	"js/cmp.js"
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
