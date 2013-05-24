// ==UserScript==
// @name        gmap_extract
// @namespace   infos_extract
// @description extract infor from g-maps
// @include     https://maps.google.com/*
// @include     http://maps.google.com/*
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @version     2
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

$(document).ready(function() {
	var cont = false;
	var bcat="";
	var queue=[];
	var delaytime=10000;
	var delay1=10000;
	var delay2=4000;
	var delay=delay1;
	var url=window.location.href+"";
	if (url.indexOf("https://maps.google.com/maps")>=0) {
		bcat=GM_getValue("gcat");
		$('body').append("<div id='thncontainer' style='position:absolute;width:180px;height:80px;border:1px solid#00ff00;top:120px;left:0px;z-index:5'>cat:"+bcat+"<div id='thninfos' align='left'></div></div>");
		setTimeout(parse_gmap,delaytime);
		setTimeout(getone,delay);
	} else {
		$('body').append("<div id='thncontainer' style='position:absolute;width:170px;height:80px;background:#dcedf2;border:1px solid#00ff00;top:200px;left:0px;z-index:5'>Category:<input id='thntext' type='text'/><input id='thnbutton' type='button' value='Save' /><div id='thninfos' align='left'></div><span id='thnmoveright'>Right</span> <span id='thnmoveleft'>Left</span></div>");
		
	}
	$("#thnbutton").click(function(){
		GM_setValue("gcat",$("#thntext").val());
		$("#thninfos").append($("#thntext").val() + "<br/>");
	});
	function gup(surl,name){
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
		var regexS = "[\\?&]"+name+"=([^&#]*)";  
		var regex = new RegExp( regexS );  
		var results = regex.exec(surl); 
		 if( results == null )    return "";  
		else    return results[1];
	}
	function parse_gmap() {
		var bname="";
		var baddr='';
		var bphon='';
		var bwebs='';
		$("#thninfos").html("Getting...<br/>");
		$("#resultspanel .res>div").each(function(){
			queue.push(this);
			//return false;
		});
		//setTimeout(next_page,i*delaytime);
	}
	function getone() {
		var block = queue.shift();
		var bname=$(block).find(".pp-place-title").length>0?$(block).find(".pp-place-title").text():"";
		var baddr=$(block).find(".pp-headline-address").length>0?$(block).find(".pp-headline-address").text():"";
		var bphon=$(block).find(".telephone").length>0?$(block).find(".telephone").text():"";
		var bwebs=$(block).find(".pp-headline-authority-page").length>0?$(block).find(".pp-headline-authority-page").text():"";
		var bplus=$(block).find("a.pp-more-content-link").length>0?$(block).find("a.pp-more-content-link").attr('href'):"";
		if (bplus) {
			bplus=gup(bplus,'q');
			var xet = bplus.split("/");
			bplus=xet[3] + "";
		}
		bwebs=$.trim(bwebs);
		if (bwebs) {
			$.post("http://www.cfdtradingnews.info/gmap.php",{name:bname,addr:baddr,phone:bphon,web:bwebs,plus:bplus,cat:bcat});
			$("#thninfos").append(bname+"<br/>");
			if (bplus) {
				window.open("https://plus.google.com/"+bplus+"/photos", '_blank');
			}
			
			window.open("http://free.chamthi.net/gemail.php?f="+bwebs, '_blank');
			delay=delay1;
		} else {
			delay=delay2;
		}
		if (queue.length>0)
			setTimeout(getone,delay);
		else
			setTimeout(next_page2,delay2);
	}
	function next_page() {
		if ($("#nn").length>0) {
			$("#nn").click();
			setTimeout(parse_gmap,delaytime);
		} 
		else {close();}
	}
	function next_page2() {
		
	}
});

