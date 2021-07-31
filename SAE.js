//缩放视图
when("load",resizeDiv);
when("resize",resizeDiv);

function resizeDiv(){
	var width = document.body.clientWidth;
	var height = document.body.clientHeight;
	var targetwidth = 800;
	if(width > targetwidth){
		targetwidth = width;
	}
	var scale = width/targetwidth;

	//按设备比例缩放div的比例
	var scaleFunc = "scale("+scale+","+scale+")";

	is("body")
		.style("width",targetwidth)

		.style("transform",scaleFunc) //缩放比例
		.style("transform-origin","left top") //缩放基点

		.style("-ms-transform",scaleFunc)     /* IE 9 */
		.style("-ms-transform-origin","left top")

		.style("-moz-transform",scaleFunc)     /* Firefox */
		.style("-moz-transform-origin","left top")

		.style("-webkit-transform",scaleFunc) /* Safari 和 Chrome */
		.style("-webkit-transform-origin","left top")

		.style("-o-transform",scaleFunc)     /* Opera */
		.style("-o-transform-origin","left top");
}

// 导航栏

var position;
var hashCorrect;
var navButton = id("nav").inner().is("li").child().is("a");
navButton.when("click",nav_click);
when("hashchange",hashChange);
hashChange();

function hashChange(){
	hashCorrect = false;

	if(window.location.hash!==""){
		position = window.location.hash.slice(1).split('/');
	}else{
		position = [];
	}

	navButton.eval(nav_each);
	if(!hashCorrect){
		window.location.hash = "#home";
	}else if(position.length>1){
		id("navReturn").style("display","inline");
		id("navReturn").attr("href",'#'+position.slice(0,-1).join('/'));
	}else{
		id("navReturn").style("display","none");
	}
	is(".content").eval(function(x){
		if(x.getAttribute("label")===position[0]){
			is(x).style("display","block");
		}else{
			is(x).style("display","none");
		}
	});
}

function nav_click(event){
	setTimeout(hashChange,0);
}

function nav_each(object){
	if(/#(.*)/.exec(object.href)[1] === position[0]){
		hashCorrect = true;
		is(object).set("className","selected");
	}else{
		is(object).set("className","");
	}
}

id("_loading").style("display","none");
is("body").style("overflow","auto");

///////////////////////////////////////////////////////////////////////////////

id("home_file").when('change',function(event){
	loadsb3(event.target,function(json,filename){
		SAE.init();
		var proj = SAE.json.load(json);
		SAE.disp.proj(proj);
		id('home_result').set("innerText",SAE.disp.data.join('\n'));
		SAE.check.proj(proj);
		SAE.check.debug();
	},function(e){alert(e);throw e;});
});
id("home_submit").when('click',function(){
	try{
		SAE.init();
		var proj = SAE.json.load(id('home_json').list[0].value);
		SAE.disp.proj(proj);
		id('home_result').set("innerText",SAE.disp.data.join('\n'));
		SAE.check.proj(proj);
		SAE.check.debug();
	} catch(e) {
		alert(e);
		throw e;
	}
});

var saeicon='<path d="M50,75 50,90M35,35 35,35M65,35 65,35M45,55c2,2.5 8,2.5 10,0M50,10c15,0 32.5,12.5 32.5,32.5c0,20 -15,32.5 -32.5,32.5c-15,0 -32.5,-12.5 -32.5,-32.5c0,-20 15,-32.5 32.5,-32.5zM20,100c20,-12 40,-12 60,0M17.5,35c-15,7.5 -12,25 -12,30M82.5,35c15,7.5 12,25 12,30" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>';
is('.sae-logo').style("overflow","hidden").append(innerSVG(100,100,saeicon));

function innerSVG(w,h,svgstr){
	var elem = makeSVG("svg",{width:w,height:h},svgstr);
	elem.style.marginBottom= "-100%";
	elem.innerHTML=svgstr;
	return elem;
}
// makeSVG
// https://blog.csdn.net/yk583443123/article/details/91883754
function makeSVG(tag, attrs) {
	var ns = 'http://www.w3.org/2000/svg';
	var xlinkns = 'http://www.w3.org/1999/xlink';

	var el= document.createElementNS(ns, tag);
	if (tag==='svg'){
		el.setAttribute('xmlns:xlink', xlinkns);
	}
	for (var k in attrs) {
		if (k === 'xlink:href') {
			el.setAttributeNS(xlinkns, k, attrs[k]);
		} else {
			el.setAttribute(k, attrs[k]);
		}
	}
	return el;
}

function loadsb3(file,func,err){
	try {
		if(!file.files || !file.files[0]){
			return;
		}
		var reader = new FileReader();
		reader.readAsBinaryString(file.files[0]);
		reader.onload = function(){
			var bstr=this.result;
			try {
				if(bstr.slice(0,4)==="PK\u0003\u0004"){
					var zip = new JSZip(bstr);
					var files = zip.files;
					if(!('project.json' in files)){
						throw new Error('sb3 文件错误 : 无法找到 project.json');
					}
					var Uint8ArrayStr = files['project.json']._data.getContent();
					func(Utf8ArrayToStr(Uint8ArrayStr),file.files[0].name);
				}else{
					//var reader = new FileReader();
					reader.readAsText(file.files[0],"utf-8");
					reader.onload = function(){
						try {
							var bstr=this.result;
							func(bstr,file.files[0].name);
						} catch (e) {
							err(e);
						}
					};
				}
			} catch (e) {
				if(e.message.slice(0,15) == "Corrupted zip :"){
					e.message = "sb3 文件错误 :" + e.message.slice(15);
				}
				err(e);
			}
		};
	} catch (e) {
		err(e);
	}
}
// Uint8Array 编码转 utf-8
// https://blog.csdn.net/weixin_42448623/article/details/107845783
function Utf8ArrayToStr(array) {
	var out, i, len, c;
	var char2, char3;

	out = "";
	len = array.length;
	i = 0;
	while (i < len) {
		c = array[i++];
		switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				// 0xxxxxxx
				out += String.fromCharCode(c);
				break;
			case 12:
			case 13:
				// 110x xxxx 10xx xxxx
				char2 = array[i++];
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14:
				// 1110 xxxx 10xx xxxx 10xx xxxx
				char2 = array[i++];
				char3 = array[i++];
				out += String.fromCharCode(((c & 0x0F) << 12) |
						((char2 & 0x3F) << 6) |
						((char3 & 0x3F) << 0));
				break;
		}
	}
	return out;
}

