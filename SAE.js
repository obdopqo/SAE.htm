//缩放视图

when("load",resizeDiv);
when("resize",resizeDiv);

when("load",loadData);

function loadData(){
	var t=localStorage.getItem("SAE.file.list");
	if(t!==null){
		SAE.file.list=JSON.parse(t);
	}
}

function saveData(){
	localStorage.setItem("SAE.file.list",JSON.stringify(SAE.file.list));
}

id("nav").inner().is("a").classadd("click");

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

	id("nav").and(is(".content"))
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

when("load",hashChange);
when("hashchange",hashChange);

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
		is(object).classadd("selected");
	}else{
		is(object).classdel("selected");
	}
}

id("_loading").style("display","none");
is("body").style("overflow","auto");

//文件

id("filelist").inner().is("li").classadd("click");
id("filelist_add").when("click",function(){
	id("home_file").call("click");
});

when("load",file_list);
when("paste",console.log);

function file_list(){
	id("filelist").child().remove();
	for(var i=0;i<SAE.file.list.length;i++){
		var fadd=create("li");
		var fadd1=create("div");
		var fadd2=create("div");
		var fdel=create("span");
		is(fadd).classadd("click");
		is(fadd1).classadd("filename");
		is(fadd2).classadd("filetime");
		is(fdel).when("click",File_del(i));
		fadd1.innerText=SAE.file.list[i].name;
		fadd2.innerText=SAE.file.list[i].time;
		fdel.innerText="删除";
		fadd2.append(fdel);
		is(fadd).append0(fadd1).append0(fadd2).when("click",File_load(i));
		id("filelist").append0(fadd);
	}

	var fadd=create("li");
	var fadd1=create("div");
	var fadd2=create("div");
	is(fadd).classadd("click");
	is(fadd1).classadd("filename");
	is(fadd2).classadd("filetime");
	fadd1.innerText="+ 添加文件";
	fadd2.innerText="添加.sb3文件或者project.json文件(不需要指定拓展名，会自动识别)";
	is(fadd).append0(fadd1).append0(fadd2).when("click",file_add);
	id("filelist").append0(fadd);
}

function file_add(){
	var file=create("input");
	file.type="FILE";
	is(file)
		.set("multiple","multiple")
		.style("display","none")
		.when("change",function(event){
			//is("body").append0(file);
			loadsb3(event.target,function(json,filename){
				SAE.file.add(filename,new Date().toLocaleString(),json);
				saveData();
				file_list();
			},function(e){
				alert(e.message);
				throw e;
			});
		});
	file.click();
}

function File_load(x){
	return function file_load(event){
		try{
			SAE.init();
			var proj = SAE.json.load(SAE.file.data(x));
			SAE.disp.proj(proj);
			id('home_result').style("color","black");
			id('home_result').set("innerText",SAE.disp.data.join('\n'));
			SAE.check.proj(proj);
			SAE.check.debug();
		}catch(e){
			id('home_result').style("color","red");
			id('home_result').set("innerText",e);
			throw(e);
		}finally{
			window.location.hash="#home";
		}
	}
}

function File_del(x){
	return function file_del(event){
		SAE.file.del(x);
		file_list();
		event.stopPropagation();
		event.cancelBubble = true;
		saveData();
	}
}

function loadsb3(file,func,err){
	try {
		for(var i=0;i<file.files.length;i++){
			var reader = new FileReader();
			reader.readAsBinaryString(file.files[i]);
			reader.onload = Loadsb3_call(file.files[i],func,err);
		}
	} catch (e) {
		err(e);
	}
}

function Loadsb3_call(file,func,err){
	return function(){
		var bstr=this.result;
		try {
			if(bstr.slice(0,4)==="PK\u0003\u0004"){
				var zip = new JSZip(bstr);
				var files = zip.files;
				if(!('project.json' in files)){
					throw new Error('sb3 文件错误 : 无法找到 project.json');
				}
				var Uint8ArrayStr = files['project.json']._data.getContent();
				func(Utf8ArrayToStr(Uint8ArrayStr),file.name);
			}else{
				var reader = new FileReader();
				reader.readAsText(file,"utf-8");
				reader.onload = function(){
					try {
						var bstr=this.result;
						func(bstr,file.name);
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
}

//统计

function SAE_stat(data,list,color){
	var innerHTML="";
	var innerList="";
	var j=-3.1415926/2;
	for(var i=0;i<data.length;i++){
		var k=j+data[i]*2*3.1415926;
		innerHTML+=SAE_statg(j,k,140,color[i]);
		innerList+="<li style=\"color:"+color[i]+";\">"+list[i]+" ("+Math.round(data[i]*100)+"%)";
		innerList+="<span style=\"background-color:"+color[i]+";width:"+(data[i]*100)+"%\"></span></li>"
		j=k;
	}
	id("stat_graph").child().set("innerHTML",innerHTML);
	id("stat_list").set("innerHTML",innerList);
}

var take=[],left=1;
for(var i=0;i<10;i++){
	take.push(left*Math.random()*0.2);
	left-=take[take.length-1];
}

var color_list = [
	"#4c97ff",
	"#9966ff",
	"#cf63cf",
	"#ffbf00",
	"#ffab19",
	"#5cb1d6",
	"#59c059",
	"#ff8c1a",
	"#ff6680",
	"#0fbd8c",
	//#ff661a
];

SAE_stat(take,[1,2,3,4,5,6,7,8,9,0],color_list);

function SAE_statg(arc,arc2,r,color){
	var innerHTML="";
	innerHTML="<path d=\"M0,0 ";
	innerHTML+=(r*Math.cos(arc))+","+(r*Math.sin(arc))+"A";
	innerHTML+=r+","+r+",1,";
	innerHTML+=(Math.abs(arc-arc2)>3.1415926?"1":"0")+","+(arc<arc2?"1":"0")+",";
	innerHTML+=(r*Math.cos(arc2))+","+(r*Math.sin(arc2));
	innerHTML+="Z\" stroke=\"none\" stroke-width=\"1px\" fill=\""+color+"\"></path>";
	return innerHTML;
}


//其他

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

