SAE = SAE || {};

SAE.json = SAE.json || {};

SAE.options = SAE.options || {};

(function(){
"use strict";
/*{{{*/
// 关于数据格式的说明，详情请查看SAE-json.md
// text - json文本 t - 文本处理位置 tnode和tdata详见SAE-json.md
var text,t,tnode,tdata;

// 临时变量
var i,j,m;
// 各个角色的列表，角色信息终止位置
var projpos,spriend;
// 角色信息列表
var spripos,isstage;
var blockpos,blockend;
var defspos;
var blockidc,blocktype;
var blockid,blockidx,blockidp;
var blockends;
var blockspecs;
var blockdata;
/*}}}*/

// 基本函数
/*{{{*/
blockspecs=[
	"#control_if",		"NK",
	"#control_if_else",	"NK2",
	"#control_repeat_until","NK",
	"#control_repeat",	"SK",
	"#control_while",	"NK",
	"#control_forever",	"K",
	"#control_for_each",	"EK",
	"#control_wait_until",	"N",
	"#control_all_at_once",	"K",
	"#operator_or",		"12",
	"#operator_and",	"12",
	"#operator_not",	"D",
	"#puzzle_setResolved",	"e", // TODO
];

SAE.json.load = function sb3load(str){
	// 先检查开头对不对，不对就可以跳过了
	// TODO: 更严格的检测
	if(str.slice(0,43)!=='{"targets":[{"isStage":true,"name":"Stage",'){
		throw "sb3 文件错误 : json开头不正确";
	}

	//读入原有数据
	tnode=SAE.data.tnode;
	tdata=SAE.data.tdata;

	text=str;
	var pos=proj();

	//保存数据
	SAE.data.tnode=tnode;
	SAE.data.tdata=tdata;
	//返回树根编号
	return pos;
};

function proj(){
	//记录角色节点位置用的列表
	projpos=[];

	//-* (作品)
	// |-* (角色1)
	// |-* (角色2)
	// |-* (角色3)
	// .
	// .
	// .
	// \-* (角色N)

	//查找monitors，从文本开始到这里就是文件的关键部分
	//注: monitors后面有舞台变量显示相关代码，不过目前还不想做处理这类的功能
	//保存角色结束位置
	spriend=findtext('],"monitors":[',0,text.length,false);
	t=findtext('{"isStage":',0,spriend,true);
	while(t!==-1){
		//处理角色的函数，t的值随着处理的进行而改变。
		projpos.push(spri());
		t=findtext('{"isStage":',t,spriend,true);
	}
	//增加作品节点
	tnode.push(tdata.length);
	for(i=0;i<projpos.length;i++){
		tdata.push(projpos[i]);
	}
	return tnode.length-1;
}
	
function spri(){
	//角色节点数据
	spripos=[];
	for(i=0;i<7;i++){
		spripos.push(-1);
	}

	//-* (角色)
	// |-"角色1" (名字)
	// |-* (造型列表)	#3 costumes
	// |-* (声音列表)	#4 sounds
	// |-* (变量列表)	#1 variables
	// |-* (列表列表)	#2 lists
	// |-* (定义列表)
	// \-* (积木列表)

	//检查是否是舞台("isStage":true)
	//判断名字和是否为背景
	if(text[t]==="t"){
		spripos[0]="(舞台)";
		isstage=1;
	}else{
		//查看名字("name":"...")
		//                ^
		t+=13;
		//获得下一字符串/数字
		spripos[0]=getval();
		isstage=0;
	}

	// 变量列表 #1 variables
	spripos[3]=datalist('},"lists":{','":["');
	// 列表列表 #2 lists
	spripos[4]=datalist('},"broadcasts":{','":["');
	// 积木和定义，spripos的第5个和第6个数字都在这里设定.
	block(spripos);
	// 造型
	//console.log(t,"t");
	//console.log(spriend,"spriend");
	t=findtext(',"costumes":[',t,spriend,false);
	spripos[1]=datalist('],"sounds":[',',"name":"');
	// 声音
	spripos[2]=datalist('],"volume":',',"name":"');

	tnode.push(tdata.length);
	for(i=0;i<spripos.length;i++){
		tdata.push(spripos[i]);
	}
	return tnode.length-1;
	//console.log(t);
}

//datalist(获取列表)用于在处理json时获得名字列表，用法:
//  datalist(文本)
//    文本:变量/列表列表结束文本
//    文本2:名字判断文本
function datalist(str,str2){
	var vlend=findtext(str,t,spriend,false);
	//查找名字
	t=findtext(str2,t,vlend,true);
	//console.log("START");
	tnode.push(tdata.length);
	while(t!==-1){
		//check()用来防止误判
		if(str2 !== '":["' || check()>-1){
			t--;
			tdata.push(getval());
		}
		//console.log(t);
		t=findtext(str2,t,vlend,true);
	}
	//console.log("OK");
	t=vlend;
	return tnode.length-1;
}
/*}}}*/

// 调试
/*{{{*/
SAE.json.debug = function sb3debug(into){
	SAE.data.debuglist=[];
	sb3debugir(into,"",into);
};

function sb3debugir(into,indent,p){
	var tnode=SAE.data.tnode;
	var tdata=SAE.data.tdata;
	var debuglist=SAE.data.debuglist;

	switch(typeof into){
		case "number":
			if(into===-1){
				console.log(indent+'-X'+(p?' ['+p+']':""));
			}else{
				// 防止重复
				if(debuglist[into]===1){
					console.log(indent+'-C'+' ('+into+')'+(p?' ['+p+']':""));
				}else{
					debuglist[into]=1;
					console.log(indent+'-*'+' ('+into+')'+(p?' ['+p+']':""));
					if(indent[indent.length-1]==='\\'){
						indent=indent.slice(0,-1)+' ';
					}
					var start=tnode[into],end=into+1===tnode.length?tdata.length:tnode[into+1];
					while(start<end){
						sb3debugir(tdata[start],indent+(start===end-1?' \\':' |'),start);
						start++;
					}
				}
			}
			break;
		case "string":
		default:
			console.log(indent+'-"'+into+'"'+(p?' ['+p+']':""));
			break;
	}
}
/*}}}*/

// 处理积木
/*{{{*/

function block(spripos){
	//上面是积木的位置表。表示每一个开头积木。
	blockpos=[];

	//这里要注意的是因为sc中积木也是通过id连接的(详见SAE-json.md)，所以会出现临时需要用id对应的情况。
	//积木的id号。
	blockid=[];
	//积木所在tnode列表的位置。
	blockidx=[];
	//tdata列表中放入了积木原始id的位置。
	blockidp=[];
	//使用SAE.json.debug(积木位置)来查看积木树。

	//定义积木位置列表，奇数项是名称，偶数项是位置。
	defspos=[];

	//积木开始位置
	t=findtext('},"blocks":{',t,spriend,false);
	//积木结束位置
	blockend=findtext('},"comments":{',t,spriend,false);

	//如果没有积木，则什么都不做
	if(blockend===t+14){
		return;
	}

	while(t!==-1){
		//当前积木编号
		//console.log("start",t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
		blockidc=getval();

		//当前积木tnode位置
		blockid.push(blockidc);
		blockidx.push(tnode.length);

		tnode.push(tdata.length);
		t+=2;
		//console.log("switch",t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
		switch(text[t]){
			case '{':
				if(textcheck('"opcode":"',t+1)){
					blockop();
					blockends='},"';
				}else{
					//console.log(t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
					throw new Error("处理积木时出错");
				}
				break;
			case '[':
				t++;
				if("123456789".includes(text[t])){
					i=getval();
					if(i<14&&i>0){
						blockval(i);
						blockends='],"';
					}else{
						//console.log(t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
						throw new Error("处理积木时出错");
					}
				}else{
					//console.log(t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
					throw new Error("处理积木时出错");
				}
				break;
			default:
				//console.log(t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
				throw new Error("处理积木时出错");
		}
		t=findtext(blockends,t,blockend,true);
		while(t!==-1&&text[t+20]!=='"'){
			t=findtext(blockends,t,blockend,true);
		}
		if(t!==-1){
			t--;
		}
		//console.log("loop",t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
	}

	//现在把积木的原始id转换为tnode位置。
	for(var i=0;i<blockidp.length;i++){
		j=blockidp[i];
		//console.log('['+j+']',tdata[j]);
		tdata[j]=blockidx[blockid.indexOf(tdata[j])];
		//console.log("=>",tdata[j]);
	}
	t=blockend;

	tnode.push(tdata.length);
	for(i=0;i<blockpos.length;i++){
		tdata.push(blockpos[i]);
	}
	spripos[6]=tnode.length-1;

	tnode.push(tdata.length);
	for(i=0;i<defspos.length;i++){
		tdata.push(defspos[i]);
	}
	spripos[5]=tnode.length-1;
}

function blockop(){
	//积木类型(opcode)
	t+=10;
	blocktype=getval();
	//console.log("block "+blocktype+' ('+(tnode.length-1)+')');
	tdata.push(blocktype);
	//"next",下一个积木的编号
	t+=9;
	if(text[t]==="n"){
		//没有下一个积木
		tdata.push(-1);
	}else{
		//获得下一个积木编号
		blockidp.push(tdata.length);
		tdata.push(getval());
		//if(tdata[tdata.length-1]==="undefined"){
		//	//console.log("error",t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
		//	throw err;
		//}
	}
	//console.log("next "+' '+tdata[tdata.length-1]);

	//初始化特殊积木数据列表
	blockdata=[];

	switch(blocktype){
		case "procedures_definition":
			//自定义积木的定义积木
			//下一个积木就是prototype，直接跳过来省事
			t=findtext('":{"opcode":"procedures_prototype","next":',t,spriend,false);

			//读取参数输入
			blockinput();
			//读取积木定义
			blockproc();

			defspos.push(tdata[tdata.length-1]);
			defspos.push(tnode.length-1);

			//定义积木一定是头部积木
			blockpos.push(tnode.length-1);
			break;
		case "procedures_call":
			//自定义积木的调用积木

			//读取参数输入
			blockinput();

			//读取积木定义
			blockproc();

			//调用积木一定不是头部积木
			break;

		case "argument_reporter_string_number":
			//处理参数

			tdata.pop();
			tdata.pop();
			tdata.push('[参数]');
			t=findtext('},"fields":{"VALUE":["',t,spriend,false);
			t--;
			tdata.push(getval());
			break;

		case "argument_reporter_boolean":
			//处理布尔(bool,六边形,是/否)参数
			tdata.pop();
			tdata.pop();
			tdata.push('[布尔参数]');
			t=findtext('},"fields":{"VALUE":["',t,spriend,false);
			t--;
			tdata.push(getval());
			break;
		default:
			//处理input输入
			blockinput();

			//处理field
			blockfield();

			//检查是否是头部积木
			t=findtext('e,"topLevel":',t,spriend,false);
			if(text[t]==="t"){
				blockpos.push(tnode.length-1);
			}
			break;
	}

	//插入需要的特殊积木
	for(i=0;i<blockdata.length;i+=2){
		tnode.push(tdata.length);
		tdata.push(blockdata[i+0]);
		tdata.push(blockdata[i+1]);
		//console.log('insert','('+(tnode.length-1)+')',blockdata[i+0],blockdata[i+1]);
	}
}

function blockval(i){
	// 获得单独的变量积木
	if(SAE.options._OrigInputType){
		blockdata.push('['+i+']');
	}else{
		switch(i){
			case 11:
				blockdata.push("[变量]"); // 12
				break;
			case 12:
				blockdata.push("[列表]"); // 13
				break;
			default:
				blockdata.push("[文本]"); // x
				break;
		}
	}
	t++;
	blockdata.push(getval());
}

function blockinput(){
	//检查特殊积木输入值顺序
	var blockspec;
	i=blockspecs.indexOf("#"+blocktype);
	if(i>-1){
		blockspec=blockspecs[i+1];
		//console.log("blockspec",blocktype,blockspec);
		//预先为输入保留空间
		for(j=0;j<blockspec.length;j++){
			tdata.push(-1);
		}
	}else{
		blockspec="";
	}
	t=findtext(',"inputs":{',t,spriend,false);
	var inputend=findtext('},"fields":{',t,spriend,false);

	//处理input输入
	findtext('":[',t,inputend,true);
	while(t!==-1){
		//获得顺序标记(其实就是参数名的最后一个字母)
		var blockspecc=text[t-4];
		// !!! 防止误判
		if(true){
			//'":1~3,'
			if("123".includes(text[t])&&text[t+1]===','){
				t+=2;
				//接下来i表示填入的数值，isblocid表示是否为积木id。
				var isblocid=0;
				//是不是空的？
				if(text[t]==="n"){
					//是空的积木
					if(text[t-2]==="3"){
						//有的时候会有类似[3,null,xxx]的特殊情况，这种情况要被忽略
						i=99999999;
					}else{
						i=-1;
					}
				}else{
					if(text[t]==='"'){
						//这是一个积木
						isblocid=1;
						i=getval();
					}else{
						// 这里是特殊的调试模式。
						if(SAE.options._OrigInputType){
							t++;
							i=getval();
							blockdata.push('['+i+']');
							t++;
						}else{
							if(text[t+1]==="1"){
								//可能是变量
								i=text[t+2];
								t+=4;
								if(i==="2"){
									blockdata.push("[变量]"); // 12
								}else if(i==="3"){
									blockdata.push("[列表]"); // 13
								}else{
									blockdata.push("[文本]"); // 1x
								}
							}else{
								t+=3;
								blockdata.push("[文本]"); // x
							}
						}
						//放入数值
						blockdata.push(getval());
						//这里预先计算好在后面积木数据增加的时候到达的位置
						i=tnode.length+blockdata.length/2-1;
						//console.log('preload ('+i+')');
					}
				}
				//到达这里时变量i表示要放入的数据，节点序号或者积木id
				if(i!==99999999){
					//判断是不是特殊顺序积木
					if(blockspec!==""){
						j=0;
						while(j<blockspec.length&&blockspec[j]!==blockspecc){
							j++;
						}
						//console.log("blockspec",blocktype,blockspecc,blockspec,j);
						if(j!==blockspec.length){
							j=tdata.length-blockspec.length+j;
							tdata[j]=i;
							if(isblocid===1){
								blockidp.push(j);
							}
						}
					}else{
						//普通顺序积木
						if(isblocid===1){
							blockidp.push(tdata.length);
						}
						tdata.push(i);
					}
				}
			}
		}
		t=findtext('":[',t,inputend,true);
	}
	t=inputend;
}

function blockfield(){
	var inputend=findtext('},"shadow":',t,spriend,false);
	//处理field
	t=findtext('":[',t,inputend,true);
	while(t!==-1){
		m=text[t-4];
		if(!",:{\\".includes(m)){//防止误判
			if(text[t]==="n"){
				tdata.push(-1);
			}else{
				blockdata.push("[选项]");
				blockdata.push(getval());
				i=tnode.length+blockdata.length/2-1;
				tdata.push(i);
			}
		}
		t=findtext('":[',t,inputend,true);
	}
	t=inputend;
}

function blockproc(){
	t=findtext('],"proccode":"',t,spriend,true);
	t--;
	var proc=getval();
	t=findtext('","warp":"',t,spriend,true);
	if(text[t]==='t'){
		proc+='%';
	}
	tdata.push(proc);
}

function check(){
	j=t-5;
	while(j>0&&text[j]!=='"'){// !!! sc2
		if(text[j]==='\\'){
			return false;
		}
		j--;
	}
	if(j>t-5-20){
		return false;
	}else{
		return true;
	}
}
/*}}}*/

// 处理文本
/*{{{*/

//findtext(文本查找)的用法:
//  findtext(要找的文本,起始位置,结束位置,是否不报错)
//    要找的文本:你要在 text 里边找的文本
//    起始位置:查找开始的位置
//    结束位置:查找结束的位置
//    是否不报错:查找失败是否不报错(true:不报错,false:报错)
//  查找到的位置(要找的文本右边的位置)会被保存在变量ret中. -1:找不到
//  例如，在
//    abcdefghi
//  里找
//    cdef
//  那么位置就是6，因为
//    abcdefghi
//      ~~~^
//         (第六个)
//  在scratch中会加一，变成7
function findtext(str,start,end,noerror){
	var next=[],ftpos=0,ret=0;
	while(ret<str.length){
		if(ret>ftpos&&str[ret]===str[ftpos]){
			ftpos++;
			ret++;
			next.push(ftpos);
		}else{
			if(ftpos===0){
				next.push(ftpos);
				ret++;
			}else{
				ftpos=next[ftpos-1];
			}
		}
	}
	ret=start;ftpos=0;
	while(ret<end){
		if(ftpos===str.length){
			return ret;
		}else{
			if(text[ret]===str[ftpos]){
				ftpos++;
				ret++;
			}else{
				if(ftpos===0){
					ret++;
				}else{
					ftpos=next[ftpos-1];
				}
			}
		}
	}
	if(!noerror){
		throw new Error("无法找到"+str);
	}else{
		return -1;
	}
}

//获得文本或者数字
function getval(){
	var ret="";
	//判断是否是字符串
	if(text[t]==='"'){
		t++;
		while(t<text.length&&text[t]!=='"'){
			ret+=text[t];
			if(text[t]==="\\"){
				ret+=text[t+1];
				t++;
			}
			t++;
		}
	}else{
		if(!"-1234567890".includes(text[t])){
			console.log(t,text.slice(t-50,t)+" ## "+text.slice(t,t+50));
			throw new Error("错误getval: "+t);
		}
		//否则，当作数字
		while(t<text.length&&!",]}".includes(text[t])){
			ret+=text[t];
			t++;
		}
	}
	return ret;
}

//比较文本从位置x开始的字符是否和字符str相同。
function textcheck(str,x){
	var i=0;
	while(i<str.length){
		if(text[x+i]!==str[i]){
			return false;
		}
		i++;
	}
	return true;
}
/*}}}*/
})();
