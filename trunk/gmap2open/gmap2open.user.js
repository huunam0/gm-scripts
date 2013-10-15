// ==UserScript==
// @name        gmap2open
// @namespace   autoaction
// @include     http://www.cfdtradingnews.info/gmap2.php*
// @include     http://localhost/gmap/gmap2.php*
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @version     1
// ==/UserScript==

$(document).ready(function() {
	var url = window.location.href+"";
	if (url.indexOf("localhost")>0)
        url = "http://localhost/gmap/getemail.php";
    else
	   url = "http://free.chamthi.net/gemail.php";
     
	setTimeout(xuli,3000);
	function xuli() {
		if ($("#bweb").length>0) {
			var bweb = $("#bweb").text()+"";
			var bplus =  $("#bplus").text()+"";
			if (bplus) {
				window.open("https://plus.google.com/"+bplus+"/photos", '_blank');
			}
			if (bweb)
				window.location.href = url + "?f="+bweb;
			else 
				window.close();
		} else {
			window.close();
		}
	}
});