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
	"html/authPage.html"
	"html/homePage.html"
	"html/userPage.html"
	"html/resetpassPage.html"
	"html/forgotpassPage.html"
)

declare -a JSfiles=(
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
