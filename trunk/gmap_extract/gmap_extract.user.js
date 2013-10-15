// ==UserScript==
// @name        gmap_extract
// @namespace   infos_extract
// @description extract infor from g-maps
// @include     https://maps.google.com/*
// @include     http://maps.google.com/*
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @version     2.4
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
if (window.top == window.self)
$(document).ready(function() {
	var cont = false;
	var bcat="";
	var bzip="";
	var stop = 0;
	var queue=[];
	var delay_loadpage=8000;
	var delay_wait = 1000; //no change
	var delay_getone = 7000;
	var n0=0;
	var url=window.location.href+"";
	var qplus=[];
	var buse = 0;
	var stt=1;
	var pause=false;
	if (url.indexOf("//maps.google.com/maps")>=0) {
		bcat=GM_getValue("gcat");
        //if (bcat) bcat+="";
		bzip=GM_getValue("gzip");
		buse=GM_getValue("guse",0);
		var xq = GM_getValue("gplus","");
		//if (xq) qplus = xq.split(",");
		$('body').append("<div id='thncontainer' style='position:absolute;width:300px;height:90px;background:#aaed99;border:1px solid#00ff00;top:120px;left:0px;z-index:5;font-size:10px;'>cat:"+bcat+"<input id='thnpause' type='button' value='Pause' /><span id='thnnote'>1</span><div id='thninfos' align='left'></div></div>");
		setTimeout(parse_gmap,delay_loadpage);
		setTimeout(getone,delay_loadpage+delay_wait);
	} else {
		$('body').append("<div id='thncontainer' style='position:absolute;width:350px;height:90px;background:#dcedf2;border:1px solid#00ff00;top:200px;left:0px;z-index:5;font-size:10px;'>Category:<input id='thncategory' type='text'/><br/>Location:<input id='thnlocation' type='text' value='Paris, France'/><br/>ZIP:<input id='thnzip' type='text'/><input id='thncheck' type='checkbox' checked/><input id='thnbutton' type='button' value='Add' /><div id='thninfos' align='left'></div></div>");
		vonglap();
	}
	$("#thnpause").click(function(){
		pause=!pause;
		if (pause) $("#thnnote").html("Pause"); else $("#thnnote").html("0");
	});
	$("#thnbutton").click(function(){
		var zip1=$("#thnzip").val();
		var zip2=zip1.split(",");
		var isUse = $("#thncheck").is(':checked')?1:0;
		for (var i=0; i<zip2.length; i++) {
			if (zip2[i].indexOf("-")>=0) {
				zip3 = zip2[i].split("-");
				var ib = parseInt(zip3[0]);
				var ie = parseInt(zip3[1]);
				if (ib<ie) {
					for (var j=ib; j<=ie; j++) {
						queue.push([$("#thnlocation").val(),$("#thncategory").val(),j,isUse]);
						$("#thninfos").append("<div>"+j+"/"+$("#thnlocation").val()+"@"+$("#thncategory").val() + "</div>");
					}
				}
			} else {
				queue.push([$("#thnlocation").val(),$("#thncategory").val(),zip2[i],isUse]);
				$("#thninfos").append("<div>"+zip2[i]+"/"+$("#thnlocation").val()+"@"+$("#thncategory").val() + "</div>");
			}
		}
		//queue.push([$("#thnlocation").val(),$("#thncategory").val(),$("#thnzip").val(),isUse]);
		//$("#thninfos").append("<div>"+$("#thnzip").val()+"/"+$("#thnlocation").val()+"@"+$("#thncategory").val() + "</div>");
		//$("#thnlocation").val("");
		//$("#thncategory").val("");
	});
	// For search-page
	function vonglap() {
		stop = GM_getValue("gstop",0);
		if (stop==1) {
			if (queue.length>=1)
				timkiem();
			else
				setTimeout(vonglap,delay_wait);
		}
		else
			setTimeout(vonglap,delay_wait);
	}
	function timkiem() {
		var muc = queue.shift();
		var oldcat = GM_getValue("gcat","");
		GM_setValue("gcat",muc[1]+";"+muc[0]);
		GM_setValue("gzip",muc[2]);
		GM_setValue("guse",muc[3]);
		GM_setValue("gstop",0);
		if (oldcat!=muc[1]) {
			var xq=GM_setValue("gplus","");
			if (xq) 
				qplus = xq.split(",");
			else
				qplus = [];
		}
		$("#gbqfq").val('category:"'+muc[1]+'",'+muc[2]+' '+muc[0]);
		$("#gbqfb").click();
		$("#thninfos div:first").css("background-color","yellow");
		setTimeout(waitandopen,delay_loadpage);
	}
	function waitandopen() {
		var nurl=$("#navbar:visible a:first").length>0?$("#navbar:visible a:first").attr("href"):"";//kiem tra 
		if (nurl) {
			nurl = nurl.replace(/&start=10/gi,"");
		} else {
			var ts=$("#gbqfq").val()+"";
			nurl = "https://maps.google.com/maps?q=" + ts.replace(" ","+");
		}
		window.open(nurl, '_blank');
		setTimeout(vonglap,delay_wait);
		$("#thninfos div:first").remove();
	}
	function gup(surl,name){
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
		var regexS = "[\\?&]"+name+"=([^&#]*)";  
		var regex = new RegExp( regexS );  
		var results = regex.exec(surl); 
		 if( results == null )    return "";  
		else    return results[1];
	}
	//For detail-page
	
	function parse_gmap() {
		//GM_setValue("gstop",0);
		var b0=0;
		var chodoi = 1000;
		
		$("#resultspanel .res>div").each(function(){
			var bname=$(this).find(".pp-place-title").length>0?$(this).find(".pp-place-title").text():"";
			var baddr=$(this).find(".pp-headline-address").length>0?$(this).find(".pp-headline-address").text():"";
			var bphon=$(this).find(".telephone").length>0?$(this).find(".telephone").text():"";
			var bwebs=$(this).find(".pp-headline-authority-page").length>0?$(this).find(".pp-headline-authority-page").text():"";
			var bplus=$(this).find("a.pp-more-content-link").length>0?$(this).find("a.pp-more-content-link").attr('href'):"";
			if (((buse) && (baddr.indexOf(bzip)>0))||(!buse)||(bzip.length<=2)) {
				if (bphon) {
					bphon=bphon.replace("()","");
					bphon=bphon.replace("  "," ");
					bphon=$.trim(bphon);
				}
				if (bplus) {
					bplus=gup(bplus,'q');
					var xet = bplus.split("/");
					bplus=xet[3] + "";
					if (!bplus.match(/[0-9]+$/)) bplus="";
				}
				bwebs=$.trim(bwebs);
				//if ((bwebs) && (qplus.indexOf(bplus)<0)) {
				if ((qplus.indexOf(bplus)<0)) {
					queue.push([bname,baddr,bphon,bwebs,bplus]);
					if (bplus) qplus.push(bplus);
					$("#thninfos").append("<div>"+stt+". "+bname+" # "+baddr+"</div>");
					stt++;
					chodoi+=1000;
				} else {
					if (!bwebs)
					$(this).css("background-color","#aaaaaa");
					else
					$(this).css("background-color","#00aaaa");
				}
				b0++;
			}
		});
		$("#thnnote").html("P"+$("#nc:visible").next().text()+"-C"+b0);
		if (b0==0) n0++; else n0=0;
		if ((buse)&&(n0>=4)) 
			stop=1;
		else
			setTimeout(next_page,chodoi);
	}
	function next_page() {
		if (pause) {
			setTimeout(next_page,delay_wait);
		} else
		if ($("#nn:visible").length>0) {
			$("#nn:visible").click();
			setTimeout(parse_gmap,delay_loadpage);
		} 
	}
	
	function getone() {
		if (queue.length>0) {
			var b = queue.shift();
			$("#thninfos div:first").css("background-color","yellow");
			//window.open("http://www.cfdtradingnews.info/gmap2.php?n="+encodeURI(b[0])+"&a="+encodeURI(b[1])+"&ph="+encodeURI(b[2])+"&w="+b[3]+"&p="+b[4]+"&c="+encodeURI(bcat),"_blank");
			window.open("http://localhost/gmap/gmap2.php?n="+encodeURI(b[0])+"&a="+encodeURI(b[1])+"&ph="+encodeURI(b[2])+"&w="+b[3]+"&p="+b[4]+"&c="+encodeURI(bcat),"_blank");
			setTimeout(getone,delay_getone);
			$("#thninfos div:first").remove();
		} else {
			if (($("#nn:visible").length<=0)||(stop==1)) {
				close_search();
			} else {
				setTimeout(getone,delay_wait);
			}
		}
	}
	function  close_search() {
		GM_setValue("gstop",1);
		//GM_setValue("gplus",qplus.join(","));
		window.close();
	}
	
});

