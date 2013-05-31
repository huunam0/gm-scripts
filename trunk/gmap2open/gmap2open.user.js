// ==UserScript==
// @name        gmap2open
// @namespace   autoaction
// @include     http://www.cfdtradingnews.info/gmap2.php*
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @version     1
// ==/UserScript==

$(document).ready(function() {
	setTimeout(xuli,2000);
	function xuli() {
		if ($("#bweb").length>0) {
			var bweb = $("#bweb").text()+"";
			//if (bweb.indexOf("http")!=0) bweb="http://"+bweb;
			//window.open("http://free.chamthi.net/gemail.php?f="+bweb, '_blank');
			var bplus =  $("#bplus").text()+"";
			if (bplus) {
				window.open("https://plus.google.com/"+bplus+"/photos", '_blank');
			}
			window.location.href = "http://free.chamthi.net/gemail.php?f="+bweb;
		} else {
			window.close();
		}
	}
});