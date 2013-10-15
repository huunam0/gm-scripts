// ==UserScript==
// @name        gplus_extract
// @namespace   infos_extract
// @include     https://plus.google.com/*/photos*
// @require		http://code.jquery.com/jquery-1.9.1.min.js
// @version     1
// ==/UserScript==
setTimeout(getImages,7000);
//var url2 = "http://www.cfdtradingnews.info/gplus.php";
var url2 = "http://localhost/gmap/gplus.php";
function getImages() {
	//alert($("img.tDMXke").length);
	//var plusid = $(location).attr('href')+"";
	
	var plusid =window.location+"";
	var pl = plusid.split('/');
	plusid = pl[3];
	//alert(plusid);
	var src="";
	var i = 1;
	var img=new Array("","","","","","","");
	$("img.tDMXke").each(function(){
		img[i]= $(this).attr('src');
		i++;
		if (i>5) return false;
	});
	//alert(img[1]);
	
	if (i>=1) {
		//$.post(url2,{id:plusid,i1:img[1],i2:img[2],i3:img[3],i4:img[4],i5:img[5]});//
		window.location.href=url2+"?id="+plusid+"&i1="+img[1]+"&i2="+img[2]+"&i3="+img[3]+"&i4="+img[4]+"&i5="+img[5]
		//post_to_url(url2,{id:plusid,i1:img[1],i2:img[2],i3:img[3],i4:img[4],i5:img[5]},'post');
		/*
		GM_xmlhttpRequest({
			method: "POST",
			url: url2,
			data: "i1="+img[1]+"&i2="+img[2]+"&i3="+img[3]+"&i4="+img[4]+"&i5="+img[5]
		});
		*/
	} else
	setTimeout(close,1000);
}
