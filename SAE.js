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
			SAE.options.graph = {};
			//SAE.disp.proj(proj);
			//SAE.check.proj(proj);
			SAE.stat.proj(proj);
			SAE.graph.proj(proj);
			//id('home_result').style("color","black");
			//id('home_result').set("innerText",SAE.disp.data.join('\n'));
			var typecount=SAE.stat.typecount.slice(0,9);
			var extenname=SAE.stat.typename.slice(9);
			var extencount=SAE.stat.typecount.slice(9);
			var extencolor=[];
			typecount.push(0);
			for(var i=0;i<extencount.length;i++){
				typecount[9]+=extencount[i];
				extencolor.push("hsl("+i*360/extencount.length+",80%,48%)");
			}
			stat_draw("stat_1",typecount,[
				"运动",
				"外观",
				"声音",
				"事件",
				"控制",
				"侦测",
				"运算",
				"变量",
				"定义",
				"拓展",
			],[
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
			]);
			if(extencount.length===0){
				id("stat_2").and(id("stat_2").prev()).style("display","none");
			}else{
				id("stat_2").and(id("stat_2").prev()).style("display","block");
				stat_draw("stat_2",extencount,extenname,extencolor);
			}
			disp_load(proj);
			//SAE.check.debug();
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

function stat_draw(statid,data,list,color){
	var svghtml="";
	var listhtml="";
	var count=0;
	for(var i=0;i<data.length;i++){
		count+=data[i];
	}
	var j=-3.1415926/2;
	for(var i=0;i<data.length;i++){
		var k=j+data[i]/count*2*3.1415926;
		svghtml+=stat_drawsvg(j,k,140,color[i]);
		listhtml+="<li style=\"color:"+color[i]+";\">"+list[i]+"\t"+data[i]+"\t"+Math.round(data[i]/count*100)+"%";
		listhtml+="<span style=\"opacity:0.2;background-color:"+color[i]+";width:100%\"></span>"
		listhtml+="<span style=\"position:relative;margin-top:-2px;background-color:"+color[i]+";width:"+(data[i]/count*100)+"%\"></span></li>"
		j=k;
	}
	id(statid).child().is(".stat_graph").set("innerHTML",svghtml);
	id(statid).child().is(".stat_list").set("innerHTML",listhtml);
}

function stat_drawsvg(arc,arc2,r,color){
	var svghtml="";
	svghtml="<path d=\"M0,0 ";
	svghtml+=(r*Math.cos(arc))+","+(r*Math.sin(arc))+"A";
	svghtml+=r+","+r+",1,";
	svghtml+=(Math.abs(arc-arc2)>3.1415926?"1":"0")+","+(arc<arc2?"1":"0")+",";
	svghtml+=(r*Math.cos(arc2))+","+(r*Math.sin(arc2));
	svghtml+="Z\" stroke=\"none\" stroke-width=\"1px\" fill=\""+color+"\"></path>";
	return svghtml;
}

//积木
var disp=[];

function disp_load(tid){
	disp=[];
	var tnode=SAE.data.tnode;
	var tdata=SAE.data.tdata;
	tnode.push(tdata.length);
	for(var i=tnode[tid];i<tnode[tid+1];i++){
		disp.push([
			tdata[i],
			i===tnode[tid]?"舞台":"角色:"+tdata[tnode[tdata[i]]],
			disp_load_spri(tdata[tnode[tdata[i]]+6])
		]);
	}
	tnode.pop();
	disp_draw(tid);
}

function disp_load_spri(tid){
	var data=[];
	var tnode=SAE.data.tnode;
	var tdata=SAE.data.tdata;
	for(var i=tnode[tid];i<tnode[tid+1];i++){
		SAE.disp.block(tdata[i]);
		var datav=[tdata[i]].concat(SAE.disp.data);
		data.push(datav);
	}
	return data;
}

function disp_draw(tid){
	var spritelist="";
	for(var i=0;i<disp.length;i++){
		spritelist+="<option value=\""+disp[i][0]+"\">"+htmlescape(disp[i][1])+"</option>";
	}
	id("disp_spri").set("innerHTML",spritelist);
	disp_draw2();
}

id("disp_spri").when("change",disp_draw2);

function disp_draw2(){
	var blocklist="";
	var data=disp[id("disp_spri").list[0].selectedIndex][2];
	if(data.length===0){
		blocklist="<option value=\"-1\">(没有积木)</option>";
	}else{
		for(var i=0;i<data.length;i++){
			blocklist+="<option value=\""+data[i][0]+"\">"+htmlescape(data[i][1])+"</option>";
		}
	}
	id("disp_block").set("innerHTML",blocklist);
	disp_draw3();
}

id("disp_block").when("change",disp_draw3);

function disp_draw3(){
	var data=disp[id("disp_spri").list[0].selectedIndex][2];
	if(data.length===0){
		id('disp_content').set("innerText","(没有积木)");
	}else{
		var datav=data[id("disp_block").list[0].selectedIndex].slice(1);
		id('disp_content').set("innerText",datav.join('\n'));
	}
	id("disp_content_pointer").style("display","none");
}

function htmlescape(html){
	// https://www.jb51.net/article/152700.htm
	var temp = document.createElement ("div");
	(temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
	var output = temp.innerHTML;
	temp = null;
	return output;
}


//选项

id("options").inner().is("input").and(id("options").inner().is("button")).classadd("click");

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

