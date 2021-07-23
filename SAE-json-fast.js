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

	//读入原有数据
	tnode=SAE.data.tnode;
	tdata=SAE.data.tdata;

	text=JSON.parse(str);
	var pos=proj(text);

	//保存数据
	SAE.data.tnode=tnode;
	SAE.data.tdata=tdata;
	//返回树根编号
	return pos;
};

function proj(json){
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
	spriend=json.targets;
	for(var i=0;i<spriend.length;i++){
		//处理角色的函数，t的值随着处理的进行而改变。
		projpos.push(spri(spriend[i]));
	}
	//增加作品节点
	tnode.push(tdata.length);
	for(i=0;i<projpos.length;i++){
		tdata.push(projpos[i]);
	}
	return tnode.length-1;
}
	
function spri(json){
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
	if(json.isStage){
		spripos[0]="(舞台)";
		isstage=1;
	}else{
		//查看名字("name":"...")
		spripos[0]=json.name;
		isstage=0;
	}

	// 变量列表 #1 variables
	spripos[3]=datalist(json.variables);
	// 列表列表 #2 lists
	spripos[4]=datalist(json.lists);
	// 积木和定义，spripos的第5个和第6个数字都在这里设定.
	block(json.blocks,spripos);
	// 造型
	//console.log(t,"t");
	//console.log(spriend,"spriend");
	spripos[1]=datalist2(json.costumes);
	// 声音
	spripos[2]=datalist2(json.sounds);

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
function datalist(json){
	tnode.push(tdata.length);
	for(var i in json){
		//console.log(i,json[i][0]);
		tdata.push(json[i][0]);
	}
	//console.log("-------");
	return tnode.length-1;
}

// -6: datalist和datalist2应该要分开
function datalist2(json){
	tnode.push(tdata.length);
	for(var i=0;i<json.length;i++){
		tdata.push(json[i].name);
		tdata.push(json[i].md5ext);
		// TODO -6: 按理来说这里应该记录文件名，你应该是忘了吧
	}
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

function block(json,spripos){
	//上面是积木的位置表。表示每一个开头积木。
	blockpos=[];

	// -6: TODO 这里可以用{}来做会更快
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

	for(var t in json){
		//当前积木编号
		blockidc=t;
		var jt=json[t];

		//当前积木tnode位置
		blockid.push(blockidc);
		blockidx.push(tnode.length);

		tnode.push(tdata.length);
		switch(typeof jt){
			case 'object':
				if(!Array.isArray(jt)){
					if(!blockop(jt,json)){
						// -6: 这里最好给个说明不然不知道的人会被坑
						//这里是为了跳过procedures_prototype(已经绑定在procedures_call中)。
						//如果blockop返回false就是被跳过了
						tnode.pop();
					}
				}else{
					blockval(jt,jt[0]);
				}
				break;
			default:
				throw new Error("处理积木时出错");
		}
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

function blockop(json,jsonParent){
	//积木类型(opcode)
	blocktype=json.opcode;
	//console.log("block "+blocktype+' ('+(tnode.length-1)+')');
	tdata.push(blocktype);
	//"next",下一个积木的编号
	if(json.next === null){
		//没有下一个积木
		tdata.push(-1);
	}else{
		//获得下一个积木编号
		blockidp.push(tdata.length);
		tdata.push(json.next);
	}
	//console.log("next "+' '+tdata[tdata.length-1]);

	//初始化特殊积木数据列表
	blockdata=[];

	switch(blocktype){
		case "procedures_definition":
			//自定义积木的定义积木
			//下一个积木就是prototype，直接跳过来省事
			// -6: 最好给个说明不然真的有点坑

			//jsonParent代表 "blocks":{...}
			json = jsonParent[json.inputs.custom_block[1]];
			//读取参数输入
			blockinput(json);
			//读取积木定义
			blockproc(json);

			defspos.push(tdata[tdata.length-1]);
			defspos.push(tnode.length-1);

			//定义积木一定是头部积木
			blockpos.push(tnode.length-1);
			break;
		case "procedures_prototype":
			return false;
		case "procedures_call":
			//自定义积木的调用积木

			//读取参数输入
			blockinput(json);

			//读取积木定义
			blockproc(json);

			//调用积木一定不是头部积木
			break;

		case "argument_reporter_string_number":
			//处理参数

			tdata.pop();
			tdata.pop();
			tdata.push('[参数]');
			tdata.push(json.fields.VALUE);
			break;

		case "argument_reporter_boolean":
			//处理布尔(bool,六边形,是/否)参数
			tdata.pop();
			tdata.pop();
			tdata.push('[布尔参数]');
			tdata.push(json.fields.VALUE);
			break;
		default:
			//处理input输入
			blockinput(json);

			//处理field
			blockfield(json);

			//检查是否是头部积木
			if(json.topLevel){
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

	return true;
}

function blockval(json,i){
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
	blockdata.push(json[1]);
}

function blockinput(json){
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

	//处理input输入
	for(var x in json.inputs){
		//获得顺序标记(其实就是参数名的最后一个字母)
		var blockspecc=x.slice(-1);
		// !!! 防止误判
		// -6: TODO ???
		var jix=json.inputs[x];
		if(true){
			//'":1~3,'
			if(jix[0]>0 && jix[0]<4){
				//接下来i表示填入的数值，isblocid表示是否为积木id。
				var isblocid=0;
				//是不是空的？
				if(jix[1] === null){
					//是空的积木
					if(jix[0] === 3){
						//有的时候会有类似[3,null,xxx]的特殊情况，这种情况要被忽略
						i=99999999;
					}else{
						i=-1;
					}
				}else{
					if(typeof jix[1] === "string"){
						//这是一个积木
						isblocid=1;
						i=jix[1];
					}else{
						// 这里是特殊的调试模式。
						if(SAE.options._OrigInputType){
							i=jix[1][0];
							blockdata.push('['+i+']');
						}else{
							switch(jix[1][0]){
								case 12:
									blockdata.push("[变量]"); // 12
									break;
								case 13:
									blockdata.push("[列表]"); // 13
									break;
								default:
									blockdata.push("[文本]"); // 1x
									break;
							}
						}
						//放入数值
						blockdata.push(jix[1][1]);
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
	}
}

function blockfield(json){
	//处理field
	for(var x in json.fields){
		var jfx=json.fields[x];
		if(jfx[0] === null){
			tdata.push(-1);
		}else{
			blockdata.push("[选项]");
			blockdata.push(jfx[0]);
			i=tnode.length+blockdata.length/2-1;
			tdata.push(i);
		}
	}
}

function blockproc(json){
	var proc=json.mutation.proccode;
	if(json.mutation.warp){
		proc+='%';
	}
	tdata.push(proc);
}

/*}}}*/
})();
