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
if (window.top == window.self)
$(document).ready(function() {
	var cont = false;
	var bcat="";
	var stop = 0;
	var queue=[];
	var delaytime=9000;
	var delay1=5000;
	var delay2=3000;
	var delay=delay1;
	var url=window.location.href+"";
	var i=0;
	if (url.indexOf("//maps.google.com/maps")>=0) {
		bcat=GM_getValue("gcat");
		$('body').append("<div id='thncontainer' style='position:absolute;width:200px;height:90px;border:1px solid#00ff00;top:120px;left:0px;z-index:5'>cat:"+bcat+"<div id='thninfos' align='left'></div></div>");
		setTimeout(parse_gmap,delaytime);
	} else {
		$('body').append("<div id='thncontainer' style='position:absolute;width:260px;height:90px;background:#dcedf2;border:1px solid#00ff00;top:200px;left:0px;z-index:5'>Category:<input id='thntext' type='text'/><br/>Keyword:<input id='thnkeys' type='text'/><input id='thnbutton' type='button' value='Add' /><div id='thninfos' align='left'></div></div>");
		vonglap();
	}
	$("#thnbutton").click(function(){
		queue.push([$("#thnkeys").val(),$("#thntext").val()]);
		$("#thninfos").append("<div>"+$("#thnkeys").val()+"@"+$("#thntext").val() + "</div>");
		$("#thnkeys").val("");
		$("#thntext").val("");
	});
	function vonglap() {
		//if (queue.length<1) return;
		stop = GM_getValue("gstop",0);
		//$("#thninfos").append(stop);
		if (stop==1) {
			if (queue.length>=1)
				timkiem();
			else
				setTimeout(vonglap,delaytime);
		}
		else
			setTimeout(vonglap,delaytime);
	}
	function timkiem() {
		
		var muc = queue.shift();
		GM_setValue("gcat",muc[1]);
		GM_setValue("gstop",0);
		$("#gbqfq").val(muc[0]);
		$("#gbqfb").click();
		$("#thninfos div:first").append("...");
		setTimeout(waitandopen,6000);
	}
	function waitandopen() {
		var nurl=$("#navbar:visible a:first").length>0?$("#navbar:visible a:first").attr("href"):"";
		if (nurl) {
			nurl = nurl.replace(/&start=10/gi,"");
		} else {
			var ts=$("#gbqfq").val()+"";
			nurl = "https://maps.google.com/maps?q=" + ts.replace(" ","+");
		}
		window.open(nurl, '_blank');
		$("#thninfos div:first").remove();
		setTimeout(vonglap,delaytime);
	}
	function gup(surl,name){
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
		var regexS = "[\\?&]"+name+"=([^&#]*)";  
		var regex = new RegExp( regexS );  
		var results = regex.exec(surl); 
		 if( results == null )    return "";  
		else    return results[1];
	}
	function parse_gmap() {
		GM_setValue("gstop",0);
		var bname="";
		var baddr='';
		var bphon='';
		var bwebs='';
		$("#thninfos").html("Getting page "+$("#nc:visible").next().text()+"...<br/>");
		$("#resultspanel .res>div").each(function(){
			queue.push(this);
			//return false;
		});
		setTimeout(getone,delay);
	}
	function getone() {
		if (queue.length>0) {
			var block = queue.shift();
			var bname=$(block).find(".pp-place-title").length>0?$(block).find(".pp-place-title").text():"";
			var baddr=$(block).find(".pp-headline-address").length>0?$(block).find(".pp-headline-address").text():"";
			var bphon=$(block).find(".telephone").length>0?$(block).find(".telephone").text():"";
			if (bphon) {
				bphon=bphon.replace("()","");
				bphon=bphon.replace("  "," ");
				bphon=$.trim(bphon);
			}
			var bwebs=$(block).find(".pp-headline-authority-page").length>0?$(block).find(".pp-headline-authority-page").text():"";
			var bplus=$(block).find("a.pp-more-content-link").length>0?$(block).find("a.pp-more-content-link").attr('href'):"";
			if (bplus) {
				bplus=gup(bplus,'q');
				var xet = bplus.split("/");
				bplus=xet[3] + "";
			}
			bwebs=$.trim(bwebs);
			if (bwebs) {
				$("#thninfos").append(String.fromCharCode(i+64)+i+"- "+bname+"<br/>");
				//$.post("http://www.cfdtradingnews.info/gmap.php",{name:bname,addr:baddr,phone:bphon,web:bwebs,plus:bplus,cat:bcat});
				window.open("http://www.cfdtradingnews.info/gmap2.php?n="+encodeURI(bname)+"&a="+encodeURI(baddr)+"&ph="+encodeURI(bphon)+"&w="+bwebs+"&p="+bplus+"&c="+encodeURI(bcat),"_blank");
				if (bplus) {
					//window.open("https://plus.google.com/"+bplus+"/photos", '_blank');
				}
				
				//window.open("http://free.chamthi.net/gemail.php?f="+bwebs, '_blank');
				delay=delay1;
			} else {
				delay=delay2;
			}
			i++;
			setTimeout(getone,delay);
		}
		else {
			i=0;
			setTimeout(next_page,2000);
			$("#thninfos").html("waiting...<br/>");
		}
		//setTimeout(getone,delay);
	}
	function next_page() {
		if ($("#nn:visible").length>0) {
			$("#nn:visible").click();
			setTimeout(parse_gmap,delaytime);
		} else {
			GM_setValue("gstop",1);
			//alert(window.location.href);
			window.close();
		}
	}
	function next_page2() {}
});

