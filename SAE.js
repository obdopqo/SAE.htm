//缩放视图

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

is(".nav").inner().is("a").classadd("click");

var pageScale=1;

// 导航栏

var position;
var hashCorrect;
var navButton = is(".nav").inner().is("a");

navButton.when("click",nav_click);

when("load",hashChange);
when("hashchange",hashChange);

function hashChange(){
	hashCorrect = false;

	if(window.location.hash!==""){
		position = window.location.hash.slice(1);
	}else{
		position = "";
	}

	navButton.eval(nav_each);
	if(!hashCorrect){
		position = "home";
	}
	isbody().child().is(".content").eval(function(x){
		if(x.getAttribute("label")===position){
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
	if(/#(.*)/.exec(object.href)[1] === position){
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

var block_color=[
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
	"#ff661a"
];

function File_load(x){
	return function file_load(event){
		try{
			SAE.init();
			var proj = SAE.json.load(SAE.file.data(x));
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
			],block_color);
			if(extencount.length===0){
				id("stat_2").and(id("stat_2").prev()).style("display","none");
			}else{
				id("stat_2").and(id("stat_2").prev()).style("display","block");
				stat_draw("stat_2",extencount,extenname,extencolor);
			}
			id("stat_3").set("innerHTML",SAE.stat.complexity+SAE.graph.complexity);
			id("stat_3_1").set("innerHTML",SAE.stat.complexity);
			id("stat_3_2").set("innerHTML",SAE.graph.complexity);
			id("stat_4").set("innerHTML",SAE.graph.complexity_1+SAE.graph.complexity_2);
			id("stat_4_1").set("innerHTML",SAE.graph.complexity_1);
			id("stat_4_2").set("innerHTML",SAE.graph.complexity_2);
			disp_load(proj);
			check_load();
			graph_load();
			//SAE.check.debug();
		}catch(e){
			alert(e);
			throw(e);
		}finally{
			window.location.hash="#stat";
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
		svghtml+=stat_drawsvg(j,k,70,color[i]);
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
			disp_load_spri(tdata[i])
		]);
	}
	tnode.pop();
	disp_draw(tid);
}

function disp_load_spri(tid){
	var data=[],datav;
	var tnode=SAE.data.tnode;
	var tdata=SAE.data.tdata;
	var costid=tdata[tnode[tid]+1];
	var sondid=tdata[tnode[tid]+2];
	var variid=tdata[tnode[tid]+3];
	var listid=tdata[tnode[tid]+4];
	var blockid=tdata[tnode[tid]+6];
	datav=["造型/声音列表"];
	for(var i=tnode[costid];i<tnode[costid+1];i+=2){
		datav.push("造型:"+tdata[i]);
		datav.push("  "+tdata[i+1]);
	}
	for(var i=tnode[sondid];i<tnode[sondid+1];i+=2){
		datav.push("声音:"+tdata[i]);
		datav.push("  "+tdata[i+1]);
	}
	data.push(datav);
	datav=["变量/列表列表"];
	for(var i=tnode[variid];i<tnode[variid+1];i++){
		datav.push("变量:"+tdata[i]);
	}
	for(var i=tnode[listid];i<tnode[listid+1];i++){
		datav.push("列表:"+tdata[i]);
	}
	data.push(datav);
	for(var i=tnode[blockid];i<tnode[blockid+1];i++){
		SAE.disp.block(tdata[i]);
		datav=[tdata[i]].concat(SAE.disp.data);
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
	for(var i=0;i<data.length;i++){
		blocklist+="<option value=\""+data[i][0]+"\">"+htmlescape(data[i][1])+"</option>";
	}
	id("disp_block").set("innerHTML",blocklist);
	disp_draw3();
}

id("disp_block").when("change",disp_draw3);

function disp_draw3(){
	var data=disp[id("disp_spri").list[0].selectedIndex][2];
	var datav=data[id("disp_block").list[0].selectedIndex].slice(1);
	id('disp_content').set("innerText",datav.join('\n'));
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

id("disp_search_input").when("input",disp_search).when("click",disp_search);

// https://blog.csdn.net/zhyaiqq123/article/details/81366620

var deb_timer = null;
function deb(method,delay){
	return function(){
		var context = this, args = arguments;
		clearTimeout(deb_timer);
		deb_timer = setTimeout(function(){
			method.apply(context, args);
		},delay);
	}
}

// https://www.cnblogs.com/webenh/p/10237224.html
// 转化为小写半角字符(如果忽略了大小写和宽字符)
function toCaseShort(chr) {
	if(SAE.options.search.ignorecase){
		chr = chr.toLowerCase();
	}
	var ret="";
	for(var i=0;i<chr.length;i++){
		if (SAE.options.search.ignorewide && chr.charCodeAt(0) > 65248 && chr.charCodeAt(0) < 65375) {
			ret+=String.fromCharCode(chr.charCodeAt(0) - 65248);
		} else {
			ret+=chr;
		}
	}
	return ret;
}

function disp_search(event){
	deb(disp_search_1,300)(event);
}

function disp_search_1(event){
	var sym = function sym(x){
		if(SAE.options.search.relative && !("search_table_loaded" in SAE)){
			if("search_table" in SAE){
				var tab = SAE.search_table;
				var tabls={};
				for(var i=0;i<tab.length;i++){
					for(var j=1;j<tab[i].length;j++){
						tabls[tab[i][j]]=tab[i][0];
					}
				}
				SAE.search_table_loaded = tabls;
			}else{
				SAE.search_table_loaded = {};
			}
		}
		if(SAE.options.search.relative){
			var tabls=SAE.search_table_loaded;
			var ret="";
			for(var i=0;i<x.length;i++){
				var ch=toCaseShort(x[i]);
				if(SAE.options.search.relative && (ch in tabls)){
					ret+=tabls[ch];
				}else{
					ret+=ch;
				}
			}
			return ret;
		}else{
			return toCaseShort(x);
		}
	};
	var reshtml="";
	var str=event.target.value;
	var res=[];
	var word=[],wordsym=[];
	var len=1;
	if(str!==""){
		while(word.length<SAE.options.search.testcount&&len<str.length){
			for(var i=0;i<str.length-len+1;i++){
				word.push(str.substr(i,len));
				wordsym.push(sym(str.substr(i,len)));
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
					var testsym=sym(test);
					var point=0;
					if(test.includes(str)){
						point=word.length+2;
					}else{
						for(var m=0;m<word.length;m++){
							if(test.includes(word[m])){
								point++;
							}else if(testsym.includes(wordsym[m])){
								point+=0.95;
							}
						}
					}
					point+=str.length>test.length?test.length/str.length:str.length/test.length;
					res.push([point/(word.length+2),disp[i][0],disp[i][2][j][0],k-1,disp[i][2][j][k]]);
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
		warnhtm+="<input type=\"CHECKBOX\" name=\""+warn[i]+"\" /><label>"+warn[i]+"</label><br/>";
	}
	for(var i=0;i<spri.length;i++){
		sprihtm+="<input type=\"CHECKBOX\" name=\""+spri[i]+"\" /><label>"+htmlescape(SAE.data.tdata[SAE.data.tnode[spri[i]]])+"</label><br/>";
	}
	id("check_spri").child().is("label").when("click",check_clear);
	id("check_spri").child().is(".expand").set("innerHTML",sprihtm).when("click",check_draw);
	id("check_warn").child().is("label").when("click",check_clear);
	id("check_warn").child().is(".expand").set("innerHTML",warnhtm).when("click",check_draw);
	check_draw();
}

function check_clear(event){
	var checks=is(event.target).next().child().is("input");
	var checkmode=true;
	checks.eval(function(x){
		if(x.checked){
			checkmode=false;
		}
	});
	checks.set("checked",checkmode);
	check_draw();
}

function check_draw(){
	var checkdata = SAE.check.data;
	var listhtm="";
	var sprititle=[];
	var spri=getvalues(id("check_spri").child().is(".expand").child().is("input"),sprititle);
	var warntitle=[];
	var warn=getvalues(id("check_warn").child().is(".expand").child().is("input"),warntitle);
	if(sprititle.length===0){
		id("check_spri").child().is("label").set("innerText","(所有角色)");
	}else{
		id("check_spri").child().is("label").set("innerText",sprititle.join(", "));
	}
	if(warntitle.length===0){
		id("check_warn").child().is("label").set("innerText","(所有类型)");
	}else{
		id("check_warn").child().is("label").set("innerText",warntitle.join(", "));
	}
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
					listhtm += "<li onclick=\"jumpto("+
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

function getvalues(expand,title){
	var values=[];
	expand.eval(function(x){
		if(x.checked){
			values.push(x.name);
			title.push(is(x).next().list[0].innerText);
		}
	});
	if(values.length===0){
		expand.eval(function(x){
			values.push(x.name);
		});
	}
	return values;
}

// 流程图

var linelist=[],lineid=[],    linetype=[];
var pointpos=[],pointspeed=[],pointtype=[];
var linetab=[];
var graphtime=null;
var graphWx0,graphWy0,graphWk0;

function graph_load(){
	graphWx0=graphWy0=0;
	graphWk0=1;
	clearInterval(graphtime);
	linelist=[];lineid=[];    linetype=[];
	pointpos=[];pointspeed=[];pointtype=[];
	linetab=[];
	var lines=SAE.graph.lines;
	var gettagnamelist = function gtagnamelist(name){
		if(!linelist.includes(name)){
			linelist.push(name);
			for(var i=0;i<lines.length;i+=2){
				if(lines[i]===name){
					gettagnamelist(lines[i+1]);
				}
				if(lines[i+1]===name){
					gettagnamelist(lines[i]);
				}
			}
		}
	};
	for(var i=0;i<lines.length;i++){
		gettagnamelist(lines[i]);
		linetype.push(graph_color(lines[i]));
	}
	for(var i=0;i<linelist.length;i++){
		pointpos.push(Math.random()*800);
		pointpos.push(Math.random()*800);
		pointspeed.push(0);
		pointspeed.push(0);
		pointtype.push(graph_color(linelist[i]));
		var sw=[];
		for(var j=0;j<linelist.length;j++){
			sw.push(0);
		}
		linetab.push(sw);
	}
	for(var i=0;i<lines.length;i++){
		if(linelist.includes(lines[i])){
			lineid.push(linelist.indexOf(lines[i]));
		}else{
			lineid.push(-1);
		}
	}
	for(var i=0;i<lineid.length;i+=2){
		linetab[lineid[i+0]][lineid[i+1]]=1;
		linetab[lineid[i+1]][lineid[i+0]]=1;
	}
	for(var i=2;i<linelist.length;i+=1){
		var pointlist=[];
		for(var j=0;j<linelist.length;j++){
			if(linetab[i][j]===1){
				pointlist.push(j);
			}
		}
		for(var j=0;j<pointlist.length;j++){
			for(var k=0;k<j;k++){
				if(linetab[pointlist[j]][pointlist[k]]!==1){
					linetab[pointlist[j]][pointlist[k]]=2;
					linetab[pointlist[k]][pointlist[j]]=2;
				}
			}
		}
	}
	var count=10;
	graphtime=setInterval(function(){
		count--;
		if(count===0){
			clearInterval(graphtime);
		}
		graph_draw(1,0.00001,5,true);
	},100);
}

function graph_draw(A,B,C,fix){
	var graphWx,graphWy,graphWk;
	var x1=pointpos[0],x2=x1,y1=pointpos[1],y2=y1;
	for(var i=1;i<linelist.length;i++){
		var x=pointpos[i*2+0],y=pointpos[i*2+1];
		if(x1>x)x1=x;
		if(x2<x)x2=x;
		if(y1>y)y1=y;
		if(y2<y)y2=y;
	}
	if(y2-y1<x2-x1){
		graphWk=600/(x2-x1);
	}else{
		graphWk=600/(y2-y1);
	}
	graphWx=(x1+x2)/2+graphWx0/graphWk;
	graphWy=(y1+y2)/2+graphWy0/graphWk;
	graphWk*=graphWk0;

	var graphtm="";
	var pointhtm="";
	for(var i=0;i<linelist.length;i++){
		var _=/"/g;
		var _2=/\\/g;
		pointhtm+="<li style=\"left:"+
			(((pointpos[i*2+0]-graphWx)*graphWk+300)-10)+
			"px;top:"+
			(((pointpos[i*2+1]-graphWy)*graphWk+300)-10)+
			"px;background-color:"+pointtype[i]+
			";\"><label>"+htmlescape(getblock(linelist[i]))+
			"</label><span style=\"background-color:"+
			pointtype[i]+
			";\">"+
			htmlescape(getblock(linelist[i]))+
			"<br/><button class=\"click\" onclick=\""+
			"search(&quot;"+
			htmlescape(getblock(linelist[i])
			.replace(_2,"\\\\")
			.replace(_,"\\&quot;"))+
			"&quot;);"+
			"\">查找这类积木</button>"+
			"</span></li>";
	}
	for(var i=0;i<lineid.length;i+=2){
		var p1=lineid[i+0],p2=lineid[i+1];
		graphtm+="<line x1=\""+
			((pointpos[p1*2+0]-graphWx)*graphWk+300)+
			"\" y1=\""+
			((pointpos[p1*2+1]-graphWy)*graphWk+300)+
			"\" x2=\""+
			((pointpos[p2*2+0]-graphWx)*graphWk+300)+
			"\" y2=\""+
			((pointpos[p2*2+1]-graphWy)*graphWk+300)+
			"\" stroke=\""+linetype[i]+
			"\" stroke-width=\"2px\"></line>";
	}
	if(fix){
		for(var _=0;_<200;_++){
			for(var i=0;i<linelist.length;i++){
				for(var j=0;j<i;j++){
					var px=pointpos[i*2+0]-pointpos[j*2+0];
					var py=pointpos[i*2+1]-pointpos[j*2+1];
					var pd=Math.sqrt(px*px+py*py);
					var k;
					switch(linetab[i][j]){
						case 0:
							k=A/(pd*pd);
							break;
						case 1:
							k=-pd*B;
							break;
						case 2:
							k=C/(pd*pd);
							break;
					}
					pointspeed[i*2+0]+=k*px;
					pointspeed[i*2+1]+=k*py;
					pointspeed[j*2+0]-=k*px;
					pointspeed[j*2+1]-=k*py;
				}
			}
			for(var i=0;i<linelist.length*2;i++){
				if(pointspeed[i]>1)pointspeed[i]=1;
				if(pointspeed[i]<-1)pointspeed[i]=-1;
				pointpos[i]+=pointspeed[i];
				pointspeed[i]*=0.95;
			}
		}
	}

	id("graph").set("innerHTML",graphtm);
	id("graph_btn").set("innerHTML",pointhtm);
}

var graphmove=false,graphmx,graphmy;

id("graph")
	.when("mousedown",graph_fix)
	.when("mousemove",graph_fix)
	.when("mouseup",graph_fix)
	.when("mousewheel",graph_fix)
	.when("touchstart",rfalse)
	.when("touchend"  ,rfalse)
	.when("touchmove" ,rfalse);

function rfalse(event){
	event.preventDefault();
	return false;
}

function graph_fix(event){
	console.log(event)
	switch(event.type){
		case "mousedown":
		//case "touchstart":
			graphmove=true;
			graphmx=-event.offsetX/graphWk0-graphWx0;
			graphmy=-event.offsetY/graphWk0-graphWy0;
			break;
		case "mouseup":
		//case "touchend":
			graphmove=false;
			break;
		case "mousemove":
		//case "touchmove":
			if(graphmove){
				graphWx0=-event.offsetX/graphWk0-graphmx;
				graphWy0=-event.offsetY/graphWk0-graphmy;
			}
			break;
		case "mousewheel":
			if(event.deltaY>0){
				graphWx0+=(event.offsetX-300)*(-0.2/graphWk0);
				graphWy0+=(event.offsetY-300)*(-0.2/graphWk0);
				graphWk0*=0.8;
			}else{
				graphWx0+=(event.offsetX-300)*(+0.2/graphWk0);
				graphWy0+=(event.offsetY-300)*(+0.2/graphWk0);
				graphWk0*=1.2;
			}
			break;
		default:
			console.log(event);
			break;
	}
	graph_draw(0,0,0,false);
	return false;
}

function search(str){
	id("disp_search_input").set("value",str).call("click");
	window.location.hash="#disp";
}

function graph_color(opcode){
	var type;
	switch(opcode[0]){
		case "F":
		case "S":
		case "C":
			type="event";
			break;
		case "O":
			type="control";
			break;
		case "D":
			type="looks";
			break;
		case "B":
			type="event";
			break;
		case "P":
			type="procedures";
			break;
		case "$":
			type=SAE.data.tdata[SAE.data.tnode[opcode]].slice(1).split("_")[0];
			break;
	}
	var i=SAE.stat.typename.indexOf(type);
	return block_color[(i===-1||i>9)?9:i];
}


function getblock(opcode){
	var type;
	switch(opcode[0]){
		case "F":
			return "当 绿旗 被点击";
		case "S":
			return "当舞台被点击";
		case "C":
			return "当角色被点击:"+opcode.slice(1);
		case "O":
			return "克隆 ["+opcode.slice(1)+" v]";
		case "D":
			return "当背景切换为 ["+opcode.slice(1)+" v]";
		case "B":
			return "当接收到 ["+opcode.slice(1)+" v]";
		case "P":
			return "定义 "+opcode.split(":")[1];
		case "$":
			var ls=opcode.slice(1).split(":");
			return "#"+ls[0]+","+ls[1];
		case "#":
			var ls=opcode.slice(1).split(":");
			return "#"+ls[0]+","+ls[1];
	}
	return "";
}


//选项

id("options").child().is("input").when("change",options_update);
//id("options_load").when("click",options_load);
//id("options_save").when("click",options_save);
options_load();

function options_update(){
	id("options").child().is("input").eval(function(x){
		switch(x.type.toLowerCase()){
			case "number":
				eval("SAE.options."+x.name+"=Number(x.value);");
				break;
			case "checkbox":
				eval("SAE.options."+x.name+"=x.checked;");
				break;
			case "radio":
				if(x.checked){
					eval("SAE.options."+x.name+"=x.value;");
				}
				break;
		}
	});
	options_save();
}

function options_draw(){
	id("options").child().is("input").eval(function(x){
		switch(x.type.toLowerCase()){
			case "number":
				eval("x.value=SAE.options."+x.name+";");
				break;
			case "checkbox":
				eval("x.checked=SAE.options."+x.name+";");
				break;
			case "radio":
					eval("x.checked=x.value==SAE.options."+x.name+";");
				break;
		}
	});
}

function options_load(){
	var t=localStorage.getItem("SAE.options");
	if(t!==null){
		SAE.options=JSON.parse(t);
	}
	options_draw();
}

function options_save(){
	localStorage.setItem("SAE.options",JSON.stringify(SAE.options));
}

////////////////////////////////////////////////////////////////////////////////

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
