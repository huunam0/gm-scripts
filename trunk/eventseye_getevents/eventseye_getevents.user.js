// ==UserScript==
// @name        eventseye_getevents
// @namespace   autogetinfos
// @include     http://www.eventseye.com/fairs/c0_*.html
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @version     1
// @grant       none
// ==/UserScript==
//>table>tr


if (window.top == window.self) {
setTimeout(doit,8000);


}

function doit() {
	//alert($("td.ltb>table tr").length);
	nextPage();
}

function nextPage() {
	$("td.nt>a.otherlink").each(function(){
		if ($(this).text().indexOf("suite")>=0) {
			alert ($(this).text());
			//return false;
		}
	});
}