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

var pageScale=1;

function resizeDiv(){
	var width = document.body.clientWidth;
	var height = document.body.clientHeight;
	var targetwidth = 800;
	if(width > targetwidth){
		targetwidth = width;
	}
	var scale = width/targetwidth;
	pageScale=scale;

	//按设备比例缩放div的比例
	var scaleFunc = "scale("+scale+","+scale+")";

	id("nav").and(isbody().child().is(".content"))
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

	disp_search_scroll();
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
	isbody().child().is(".content").eval(function(x){
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
isbody().style("overflow","auto");

//文件

id("filelist").inner().is("li").classadd("click");
id("filelist_add").when("click",function(){
	id("home_file").call("click");
});

when("load",file_list);
when("paste",console.log);

function file_list(){
	// TODO
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
			SAE.check.proj(proj);
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
			id("stat_3").set("innerHTML",SAE.stat.complexity+SAE.graph.complexity);
			disp_load(proj);
			check_load();
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

function jumpto(spid,bloid,line){
	var i;
	for(i=0;i<disp.length;i++){
		if(spid===disp[i][0]){
			id("disp_spri").list[0].selectedIndex=i;
			break;
		}
	}
	disp_draw2();
	var data=disp[i][2];
	for(i=0;i<data.length;i++){
		if(bloid===data[i][0]){
			id("disp_block").list[0].selectedIndex=i;
			break;
		}
	}
	disp_draw3();
	window.location.hash="#disp";
	hashChange();
	id("disp_content_pointer")
		.style("display","block")
		.style("top",11+17*line);
	document.body.scrollTop=(id("disp_content_pointer").list[0].offsetTop)*pageScale-document.body.clientHeight/2;
}

when("scroll",disp_search_scroll);

function disp_search_scroll(){
	id("disp_search").style("top",(document.body.scrollTop/pageScale+100)+"px");
}

id("disp_search_input").when("input",disp_search);

function disp_search(event){
	var reshtml="";
	var str=event.target.value;
	var res=[];
	var word=[];
	var len=1;
	if(str!==""){
		while(word.length<SAE.options.search.testcount&&len<str.length){
			for(var i=0;i<str.length-len+1;i++){
				word.push(str.substr(i,len));
				if(word.length===SAE.options.search.testcount){
					break;
				}
			}
			len++;
		}
		for(var i=0;i<disp.length;i++){
			for(var j=0;j<disp[i][2].length;j++){
				for(var k=1;k<disp[i][2][j].length;k++){
					var test=disp[i][2][j][k];
					var point=0;
					if(test.includes(str)){
						point=word.length+1;
					}else{
						for(var m=0;m<word.length;m++){
							if(test.includes(word[m])){
								point++;
							}
						}
					}
					res.push([point/(word.length+1),disp[i][0],disp[i][2][j][0],k-1,disp[i][2][j][k]]);
				}
			}
		}
	}
	res.sort(function(a,b){
		return b[0]-a[0];
	});
	for(var i=0;i<res.length;i++){
		if(i>=SAE.options.search.count){
			break;
		}
		reshtml+="<li class=\"click\" onclick=\"jumpto("+
			res[i][1]+","+res[i][2]+","+res[i][3]+")\">"+
			"<span class=\"search_cover\" style=\"width:"+res[i][0]*100+"%;background-color:hsl("+res[i][0]*120+",100%,40%);\"></span>"+
			htmlescape(res[i][4])+
			"</li>";
	}
	id("disp_search_result").style("height",20*(i>20?20:i)+"px");
	id("disp_search_result").set("innerHTML",reshtml);
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

//查错

var check=[];

function check_load(){
	var checkdata = SAE.check.data;
	var sprihtm="";
	var spri=[];
	var warnhtm="";
	var warn=[];
	for(var i=0;i<checkdata.length;i+=6){
		if(!warn.includes(checkdata[i+0])){
			warn.push(checkdata[i+0]);
		}
		if(!spri.includes(checkdata[i+4])){
			spri.push(checkdata[i+4]);
		}
	}
	warn=warn.sort();
	spri=spri.sort();
	for(var i=0;i<warn.length;i++){
		warnhtm+="<option value=\""+warn[i]+"\">"+warn[i]+"</option>";
	}
	for(var i=0;i<spri.length;i++){
		sprihtm+="<option value=\""+spri[i]+"\">"+htmlescape(SAE.data.tdata[SAE.data.tnode[spri[i]]])+"</option>";
	}
	id("check_spri").set("innerHTML",sprihtm).when("click",check_draw);
	id("check_type").set("innerHTML",warnhtm).when("click",check_draw);
	check_draw();
}

function check_draw(){
	var checkdata = SAE.check.data;
	var listhtm="";
	var spri=getvalues(id("check_spri").list[0]);
	var warn=getvalues(id("check_type").list[0]);
	var limit=0;
	for(var i=0;i<checkdata.length;i+=6){
		if(
			spri.includes(String(checkdata[i+4]))
			&& warn.includes(String(checkdata[i+0]))
		){
			var cl=SAE.disp.block(checkdata[i+5],checkdata[i+2]);
			var dispdata="";
			if(cl===-1){
				dispdata="无法显示预览";
			}else{
				if(limit<100){
					limit++;
					var j=cl;
					if(j>SAE.disp.data.length-5){
						j=SAE.disp.data.length-5;
					}
					if(j<4){j=4;}
					for(var k=-4;k<5;k++){
						if(j+k>=SAE.disp.data.length){
							dispdata+="<br/>";
						}else{
							if(j+k===cl){
								dispdata+="<span class=\"highlight\">"+htmlescape(SAE.disp.data[j+k])+"</span><br>";
							}else{
								dispdata+=htmlescape(SAE.disp.data[j+k])+"<br>";
							}
						}
					}
					listhtm += "<li class=\"spri"+checkdata[i+4]+
						" warn"+checkdata[i+0]+"\" onclick=\"jumpto("+
						checkdata[i+4]+","+
						checkdata[i+5]+","+
						cl+")\">"+
						"<div><span class=\"checkid\">"+htmlescape(checkdata[i+0])+
						"</span>"+
						htmlescape(checkdata[i+1])+
						"</div><div class=\"sccode\">"+
						dispdata+
						"</div></li>";
				}
			}
		}
	}
	if(limit>=100){
		listhtm += "<li>错误太多，只显示前100个</li>"
	}

	id("check_list").set("innerHTML",listhtm);
	id("check_list").child().is("li").classadd("click");
}

function getvalues(select){
	var options=select.selectedOptions;
	var values=[];
	for(var i=0;i<options.length;i++){
		values.push(options[i].value);
	}
	if(values.length===0){
		options=select.options;
		for(var i=0;i<options.length;i++){
			values.push(options[i].value);
		}
	}
	return values;
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

