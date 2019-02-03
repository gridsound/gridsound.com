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

	"css/btn.css"
	"css/form.css"
	"css/rippleEffect.css"
	"css/root.css"
	"css/reset.css"
	"css/cmp.css"
	"css/main.css"
	"css/head.css"
	"css/footer.css"
	"css/homePage.css"
	"css/authPages.css"
	"css/userPageSection.css"
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
	"daw-core/src/DAWCore.js"
	"daw-core/src/DAWCore.prototype.get.js"
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
	"daw-core/src/json/synth.js"
	"daw-core/src/utils/uuid.js"
	"daw-core/src/utils/time.js"
	"daw-core/src/utils/trim2.js"
	"daw-core/src/utils/uniqueName.js"
	"daw-core/src/utils/composeUndo.js"
	"daw-core/src/utils/castToNumber.js"
	"daw-core/src/utils/objectIsEmpty.js"
	"daw-core/src/utils/objectDeepCopy.js"
	"daw-core/src/utils/objectDeepAssign.js"
	"daw-core/src/utils/objectDeepFreeze.js"
	"daw-core/src/actions/addCompositionsFromLocalStorage.js"
	"daw-core/src/actions/addNewComposition.js"
	"daw-core/src/actions/addComposition.js"
	"daw-core/src/actions/addCompositionByJSON.js"
	"daw-core/src/actions/addCompositionByBlob.js"
	"daw-core/src/actions/addCompositionByURL.js"
	"daw-core/src/actions/abortWAVExport.js"
	"daw-core/src/actions/liveChangeSynth.js"
	"daw-core/src/actions/exportCompositionToWAV.js"
	"daw-core/src/actions/exportCompositionToJSON.js"
	"daw-core/src/actions/changePatternSynth.js"
	"daw-core/src/actions/changePatternKeys.js"
	"daw-core/src/actions/deleteComposition.js"
	"daw-core/src/actions/closeComposition.js"
	"daw-core/src/actions/openComposition.js"
	"daw-core/src/actions/saveComposition.js"
	"daw-core/src/actions/newComposition.js"
	"daw-core/src/actions/removePattern.js"
	"daw-core/src/actions/clonePattern.js"
	"daw-core/src/actions/removeSynth.js"
	"daw-core/src/actions/openPattern.js"
	"daw-core/src/actions/namePattern.js"
	"daw-core/src/actions/newPattern.js"
	"daw-core/src/actions/openSynth.js"
	"daw-core/src/actions/nameSynth.js"
	"daw-core/src/actions/newSynth.js"

	"gs-api-client/gsapiClient.js"

	"js/common/rippleEffect.js"
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

buildMaster() {
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

if [ $# -gt 0 ] && [ $1 = "prod" ]
then
	buildMaster
else
	buildDev
fi
