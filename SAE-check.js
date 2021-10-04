// check检查
(function(){
"use strict";

var tnode,tdata,checkdata,isstage;
var fromhead,fromproj,fromspri;
var broadlist;
var sprilist,     costlist,soundlist,     varilist,     listlist,defslist,argslist;
var          stagecostlist,          stagevarilist,stagelistlist,defswarp,argblist;
var               costfile,soundfile,     variused,     listused,defsused,argsused;
var                                  stagevariused,stagelistused,defsposi,argbused;
var blocktype,blockstack;

var spriblocklist = [
	"motion_goto_menu",
	"motion_glideto_menu",
	"motion_pointtowards_menu",
	"control_create_clone_of_menu",
	"sensing_touchingobjectmenu",
	"sensing_distancetomenu",
	"sensing_of_object_menu",
];

var block1xx_listref = [
	"data_itemoflist",
	"data_itemnumoflist",
	"data_listcontainsitem",
];

var block2xx_noness = [
	"operator_add",
	"operator_subtract",
	"operator_multiply",
	"operator_divide",
	"operator_gt",
	"operator_lt",
	"operator_equals",
	"operator_join",
	"operator_letter_of",
	"operator_length",
	"operator_contains",
	"operator_mod",
	"operator_round"
]

var block2xx_number = [
	"operator_add",
	"operator_subtract",
	"operator_multiply",
	"operator_divide",
	"operator_random",
	"operator_gt",
	"operator_lt",
	//"operator_equals",
	//"operator_and",
	//"operator_or",
	//"operator_not",
	"operator_join",
	"operator_letter_of",
	"operator_length",
	"operator_contains",
	"operator_mod",
	"operator_round",
	"operator_mathop",
]

var block2xx_change = [
	"motion_changexby",
	"motion_changeyby",
	"looks_changesizeby",
	"looks_changeeffectby",
	"looks_goforwardbackwardlayers",
	"sound_changeeffectby",
	"sound_changevolumeby",
	"data_changevariableby",
	"music_changeTempo",
	"pen_changePenColorParamBy",
	"pen_changePenSizeBy",
	"box2d_changeVelocity",
	"box2d_changeScroll"
];

// 这些积木都是设定模式用的，两个相同的设定积木连用可以判断为错误。
var block3xx_same = [
	"motion_changexby",
	"motion_changeyby",
	"motion_setx",
	"motion_sety",
	"motion_turnleft",
	"motion_turnright",
	"motion_gotoxy",
	"motion_goto",
	"motion_pointtowards",
	"motion_pointindirection",
	"motion_ifonedgebounce",
	"motion_setrotationstyle",
	"looks_changesizeby",
	"looks_setsizeto",
	"looks_say",
	"looks_think",
	"looks_show",
	"looks_hide",
	"looks_goforwardbackwardlayers",
	"looks_switchbackdropto",
	"looks_gotofrontback",
	"looks_cleargraphiceffects",
	"sound_changevolumeby",
	"sound_stopallsounds",
	"sound_setvolumeto",
	"sensing_setdragmode",
	"sensing_resettimer",
	"pen_changePenSizeBy",
	"pen_clear",
	"pen_stamp",
	"pen_penDown",
	"pen_penUp",
	"pen_setPenColorToColor",
	"pen_setPenSizeTo",
	"music_changeTempo",
	"music_setInstrument",
	"music_setTempo",
	"videoSensing_videoToggle",
	"faceSensing_goToPart",
	"faceSensing_pointInFaceTiltDirection",
	"faceSensing_setSizeToFaceSize",
];

var block3xx_same2 = [
	"looks_changeeffectby",
	"looks_seteffectto",
	"sound_changeeffectby",
	"sound_seteffectto",
	"data_changevariableby",
	"data_setvariableto",
	"pen_changePenColorParamBy",
	"pen_setPenColorParamTo"
];

var block3xx_same1 = [
	"data_deletealloflist",
	"data_showlist",
	"data_showvariable",
	"data_hidelist",
	"data_hidevariable",
];

var block3xx_textblock = [
	"sensing_username",
	"operator_join",
	"operator_letter_of",
	"translate_getTranslate",
	"translate_getViewerLanguage",
];

var block3xx_logicblock = [
	"[布尔参数]",
	"sensing_keypressed",
	"sensing_mousedown",
	"operator_gt",
	"operator_lt",
	"operator_equals",
	"operator_and",
	"operator_or",
	"operator_not",
	"operator_contains",
	"data_listcontainsitem",
	"tw_getButtonIsDown",
	"community_isFollower",
	"community_isProjectLover",
	"puzzle_isPaintSameAsWatermark",
	"community_isMyFans",
	"community_isLiked",
	"faceSensing_faceIsDetected",
];

var block3xx_waitblock = [
	"control_wait",
	"control_wait_until",
	"looks_switchbackdroptoandwait",
	"sound_playuntildone",
	"event_broadcastandwait",
	"sensing_askandwait",
];
	
var block4xx_spriteref = [
	"motion_direction",
	"motion_xposition",
	"motion_yposition",
	"looks_costumenumbername",
	"looks_backdropnumbername",
	"looks_size",
	"sound_volume",
	"sensing_answer",
	"operator_random",
	"data_itemnumoflist",
	"data_itemoflist",
	"data_lengthoflist",
	"data_listcontainsitem",
	"music_getTempo"
];

SAE.check.proj = function proj(id){
	tnode = SAE.data.tnode;
	tdata = SAE.data.tdata;

	SAE.check.data = [];
	checkdata = SAE.check.data;

	fromproj = id;

	tnode.push(tdata.length);

	//

	sprilist=[
		'_stage_',
		'_myself_',
		'_mouse_',
		'_random_',
		'_edge_'
	];
	
	// 这里假设第一个就是舞台，把它跳过
	for(var i=tnode[id]+1;i<tnode[id+1];i++){
		sprilist.push(tdata[tnode[tdata[i]]]);
	}

	// 扫描广播接收积木
	broadlist=[];
	for(var i=tnode[id];i<tnode[id+1];i++){
		broadspri(tdata[i]);
	}
	DEBUG("broadlist",broadlist);
	
	isstage=1;
	DEBUG(tnode[id],tnode[id+1]);
	for(var i=tnode[id];i<tnode[id+1];i++){
		// 这里假设第一个就是舞台
		spri(tdata[i]);
		isstage=0;
	}

	for(var i=0;i<stagevariused.length;i++){
		if(stagevariused[i] === 0){
			warn(112,"未使用的全局变量: " + stagevarilist[i],id);
		}
	}

	for(var i=0;i<stagelistused.length;i++){
		if(stagelistused[i] === 0){
			warn(122,"未使用的全局列表: " + stagelistlist[i],id);
		}
	}

	tnode.pop();
}

function broadspri(id){
	var i=tdata[tnode[id]+6];
	for(var j=tnode[i];j<tnode[i+1];j++){
		var blo=tnode[tdata[j]];
		DEBUG("broadspri",tdata[blo]);
		if(tdata[blo]==="event_whenbroadcastreceived"){
			var check=tdata[blo+2];
			DEBUG("broadspri",tdata[blo+2],tdata[tnode[check]]);
			if(tdata[tnode[check]]!=='[选项]'){
				warn(999,"未预料到的情况",check);
			}else{
				broadlist.push(tdata[tnode[check]+1]);
			}
		}
	}
}

function spri(id){
	fromspri = id;

	// -6: 这里同理
	soundlist = load2(tdata[tnode[id]+2],[]);
	if(isstage){
		stagecostlist = load2(tdata[tnode[id]+1],[]);
		stagevarilist = load(tdata[tnode[id]+3]);
		stagelistlist = load(tdata[tnode[id]+4]);
		stagevariused = zeroarray(stagevarilist.length);
		stagelistused = zeroarray(stagelistlist.length);
		costlist = [];
		varilist = [];
		listlist = [];
	}else{
		costlist = load2(tdata[tnode[id]+1],[]);
		varilist = load(tdata[tnode[id]+3]);
		listlist = load(tdata[tnode[id]+4]);
	}
	defsposi=[];
	defslist = load2(tdata[tnode[id]+5],defsposi);

	variused = zeroarray(varilist.length);
	listused = zeroarray(listlist.length);
	defsused = zeroarray(defslist.length);

	blocklist(tdata[tnode[id]+6]);

	for(var i=0;i<variused.length;i++){
		if(variused[i] === 0){
			warn(111,"未使用的变量: " + varilist[i],0);
		}
	}

	for(var i=0;i<listused.length;i++){
		if(listused[i] === 0){
			warn(121,"未使用的列表: " + listlist[i],0);
		}
	}

	for(var i=0;i<defsused.length;i++){
		if(defsused[i] === 0){
			warn(141,"未使用的自定义积木: " + defslist[i],id);
		}
	}
}

function load(id){
	var ret=[];
	for(var i=tnode[id];i<tnode[id+1];i++){
		ret.push(tdata[i]);
	}
	return ret;
}

//load2，用于获取造型，声音列表中的名称
function load2(id,data2){
	var ret=[];
	for(var i=tnode[id];i<tnode[id+1];i+=2){
		ret.push(tdata[i]);
		data2.push(tdata[i+1]);
	}
	return ret;
}

function blocklist(id){
	for(var i=tnode[id];i<tnode[id+1];i++){
		DEBUG("blocklist",i,tdata[i]);
		blockstart(tdata[i]);
	}
}

function blockstart(id){
	// 这里的fromhead是全局变量，意味着接下来的调用中fromhead就是积木id的头积木。
	// 有一个例外，就是追踪引用的时候可能会跳转到积木定义中，这是积木定义就会变成头积木
	fromhead = id;
	//warn(1,"blockstart",id);
	DEBUG("blockstart",id);

	argslist=[];
	argsused=[];
	argblist=[];
	argbused=[];

	blockstack=[];

	blocktype=tdata[tnode[id]];
	switch(blocktype){
		case 'procedures_definition':
			//记录使用的参数
			for(var i=tnode[id]+2;i<tnode[id+1]-1;i++){
				var aid=tnode[tdata[i]];
				switch(tdata[aid]){
					case '[参数]':
						argslist.push(tdata[aid+1]);
						argsused.push(0);
						break;
					case '[布尔参数]':
						argblist.push(tdata[aid+1]);
						argbused.push(0);
						break;
					default:
						warn(134,"未知参数类型: " + tnode[aid],fromhead);
				}
			}
			break;
		default:
			//判断是不是开头积木
			if(blocktype == "control_start_as_clone" ||
				blocktype.includes("_when")){
				//如果是，如果没有下一个积木，那么发出提示
				if(tdata[tnode[id]+1] === -1){
					warn(100,"帽子积木下没有连接过程积木",id);
				}
			}else{
				//否则无法被执行
				warn(101,"无法被执行的积木",id);
			}
			break;
	}
	block(id);

	for(var i=0;i<argsused.length;i++){
		if(argsused[i] === 0){
			warn(131,"未使用的参数: " + argslist[i],id);
		}
	}

	for(var i=0;i<argbused.length;i++){
		if(argbused[i] === 0){
			warn(133,"未使用的布尔参数: " + argblist[i],id);
		}
	}
}

function block(id){
	DEBUG("block st",id);
	var v=tnode[id],v1=tdata[v+1],v2=tdata[v+2];
	blocktype=tdata[v];
	//warn(2,"block: " + blocktype,id);

	block1xx(id);
	block2xx(id);
	block3xx(id);

	DEBUG("bl",id);
	DEBUG("block",id,blocktype[0]);

	if(blocktype[0] !== '['){
		var j=0;
		if(blocktype === 'procedures_definition' || blocktype === 'procedures_call'){
			j=1;
		}
		for(var i=tnode[id]+2;i<tnode[id+1]-j;i++){
			if(tdata[i]!==-1){
				DEBUG("block1",tdata[i]);
				blockstack.push(id);
				block(tdata[i]);
				blockstack.pop();
			}else{
				warn(102,"缺少积木",id);
			}
		}
		if(v1!==-1){
			DEBUG("check next",id,tnode[id],v1);
			block(v1);
		}
	}
}

function block1xx(id){
	var v=tnode[id],v1=tdata[v+1],v2=tdata[v+2];
	switch(blocktype){
			//下面的重复内容主要是考虑到特殊情况下不同的内容可能会区别对待
		case 'procedures_call':
			var v_=tdata[tnode[id+1]-1];
			var i=defslist.indexOf(v_);
			if(i===-1){
				DEBUG("defslist",defslist,v_);
				warn(140,"积木未定义",id);
			}else{
				defsused[i]=1;
			}
			break;

		case '[变量]':
			var i=varilist.indexOf(v1);
			if(i===-1){
				var i=stagevarilist.indexOf(v1);
				if(i===-1){
					warn(110,"变量" + v1 + "不在变量列表中",id);
				}else{
					stagevariused[i]=1;
				}
			}else{
				variused[i]=1;
			}
			break;

		case '[列表]':
			var i=listlist.indexOf(v1);
			if(i===-1){
				var i=stagelistlist.indexOf(v1);
				if(i===-1){
					warn(120,"列表 " + v1 + " 不在列表列表中",id);
				}else{
					stagelistused[i]=1;
				}
			}else{
				listused[i]=1;
			}
			break;

		case '[参数]':
			var i=argslist.indexOf(v1);
			if(i===-1){
				warn(130,"参数 " + v1 + " 没在积木定义中出现",id);
			}else{
				argsused[i]=1;
			}
			break;

		case '[布尔参数]':
			var i=argblist.indexOf(v1);
			if(i===-1){
				warn(132,"布尔参数 " + v1 + " 没在积木定义中出现",id);
			}else{
				argbused[i]=1;
			}
			break;
			//下面的内容相似度过高
		case 'looks_costume':
			if(tdata[tnode[v2]]!=='[选项]'){
				warn(999,"未预料到的情况",v2);
			}else{
				if(!costlist.includes(tdata[tnode[v2]+1])){
					DEBUG("warn",160,tdata[tnode[v2]+1],costlist);
					warn(160,"造型 " + tdata[tnode[v2]+1] + " 不存在",id);
				}
			}
			break;

		case 'looks_backdrops':
		case "event_whenbackdropswitchesto":
			if(tdata[tnode[v2]]!=='[选项]'){
				warn(999,"未预料到的情况",v2);
			}else{
				if(!stagecostlist.includes(tdata[tnode[v2]+1])){
					DEBUG("warn",170,tdata[tnode[v2]+1],stagecostlist);
					warn(170,"背景 " + tdata[tnode[v2]+1] + " 不存在",id);
				}
			}
			break;

		case 'sound_sounds_menu':
			if(tdata[tnode[v2]]!=='[选项]'){
				warn(999,"未预料到的情况",v2);
			}else{
				if(!soundlist.includes(tdata[tnode[v2]+1])){
					DEBUG("warn",180,tdata[tnode[v2]+1],soundlist);
					warn(180,"声音 " + tdata[tnode[v2]+1] + " 不存在",id);
				}
			}
			break;

		case 'event_broadcast':
		case 'event_broadcastandwait':
			// 广播中的下拉列表看起来是选项在json中却是文本，详见SAE-json.md中的__inputs__部分。
			if(tdata[tnode[v2]]==='[文本]'){
				if(!broadlist.includes(tdata[tnode[v2]+1])){
					DEBUG("warn",190,tdata[tnode[v2]+1],broadlist);
					warn(190,"没有接收广播 " + tdata[tnode[v2]+1] + " 的积木",id);
				}
			}
			break;

		default:
			if(spriblocklist.includes(blocktype)){
				if(tdata[tnode[v2]]!=='[选项]'){
					warn(999,"未预料到的情况",v2);
				}else{
					if(!sprilist.includes(tdata[tnode[v2]+1])){
						DEBUG(sprilist,tdata[tnode[v2]+1]);
						warn(150,"角色 " + tdata[tnode[v2]+1] + " 不存在",id);
					}
				}
			}
			break;
	}
}

function block2xx(id){
	var v=tnode[id],v2=tdata[v+2],v3=tdata[v+3];
	var j=0;

	if(block2xx_number.includes(blocktype)){
		for(var i=v+2;i<tnode[id+1];i++){
			if(checkvalue(i,"",'===')){
				warn(200,"缺少数字",id);
			}
			if(block3xx_textblock.includes(tdata[tnode[tdata[v+2]]])
			|| block3xx_textblock.includes(tdata[tnode[tdata[v+3]]])){
				warn(202,"使用文本积木",id);
			}
			if(block3xx_logicblock.includes(tdata[tnode[tdata[v+2]]])
			|| block3xx_logicblock.includes(tdata[tnode[tdata[v+3]]])){
				warn(203,"使用判断积木",id);
			}
		}
	}

	if(block2xx_noness.includes(blocktype)){
		var j=0;
		for(var i=v+2;i<tnode[id+1];i++){
			var check=tdata[tnode[i]];
			if(check!==-1){
				if(tdata[check]!=="[文本]"){
					//有不是文本的输入
					j=1;
				}
			}
		}
		if(j===0){
			warn(201,"常数计算",id);
		}
	}

	switch(blocktype){
		case 'operator_add':
			if(checkvalue(v+2,0,'==')){
				warn(210,"无意义的计算:加0",id);
			}
			if(checkvalue(v+3,0,'==')){
				warn(210,"无意义的计算:加0",id);
			}
			break;
		case 'operator_subtract':
			if(checkvalue(v+3,0,'==')){
				warn(211,"无意义的计算:减0",id);
			}
			break;
		case 'operator_multiply':
			if(checkvalue(v+2,0,'==')){
				warn(212,"无意义的计算:乘0",id);
			}
			if(checkvalue(v+3,0,'==')){
				warn(212,"无意义的计算:乘0",id);
			}
			DEBUG("checking",id,v+2);
			if(checkvalue(v+2,1,'==')){
				warn(213,"无意义的计算:乘1",id);
			}
			DEBUG("checking",id,v+3);
			if(checkvalue(v+3,1,'==')){
				warn(213,"无意义的计算:乘1",id);
			}
			break;
		case 'operator_divide':
			if(checkvalue(v+3,1,'==')){
				warn(214,"无意义的计算:除1",id);
			}
			if(checkvalue(v+2,0,'==')){
				warn(215,"无意义的计算:0被除",id);
			}
			if(checkvalue(v+3,0,'==')){
				warn(215,"无意义的计算:除0",id);
			}
			break;
		case 'operator_mod':
			if(checkvalue(v+3,0,'==')){
				warn(216,"无意义的计算:取模0",id);
			}
			break;
		case 'operator_gt':
		case 'operator_lt':
			if(checkvalue(v+2,0,'nonumber')
			|| checkvalue(v+3,0,'nonumber')){
				warn(217,"使用非数字比较大小",id);
			}
			break;
	}

	switch(blocktype){
		case 'operator_mathop':
			var check=tdata[v+3];
			DEBUG("operator_mathop",v+3,tdata[v+3]);
			if(tdata[tnode[check]]!=='[选项]'){
				warn(999,"未预料到的情况",check);
			}else{
			DEBUG("operator_mathop_val",tnode[check]+1,tdata[tnode[check]+1]);
				switch(tdata[tnode[check]+1]){
					case 'sqrt':
						if(checkvalue(v+2,0,'<')){
							warn(220,"求负数的平方根",id);
						}
						break;
					case 'asin':
					case 'acos':
						if(checkvalue(v+2,-1,'<') || checkvalue(v+2,1,'>')){
							warn(221,"反三角函数自变量不在(-1,1)之间",id);
						}
						break;
					case 'ln':
					case 'log':
						if(checkvalue(v+2,0,'<') || checkvalue(v+2,0,'==')){
							warn(222,"对数函数自变量不大于0",id);
						}
						break;
				}
			}
			break;
		case 'data_itemnumoflist':
			if(checkvalue(v+2,1,'<')){
				warn(223,"列表编号不是正数",id);
			}
			break;
		case 'control_repeat':
		case 'control_for_each':
			if(checkvalue(v+2,1,'<')){
				warn(224,"重复次数不是正数",id);
			}
		case 'control_wait':
			if(checkvalue(v+2,0,'<')){
				warn(225,"等待时间小于0",id);
			}
			break;
		case 'event_whengreaterthan':
			if(checkvalue(v+2,0,'<')){
				warn(226,"触发数值小于0",id);
			}
			if(checkvalue(v+3,"LOUDNESS",'===') && checkvalue(v+2,100,'>')){
				warn(227,"触发数值大于100",id);
			}
			break;
	}

	if(block2xx_change.includes(blocktype)){
		for(var i=v+2;i<tnode[id+1];i++){
			if(checkvalue(i,0,'==')){
				warn(230,"改变量等于0",id);
			}
		}
	}
}

function block3xx(id){
	var v=tnode[id],v1=tdata[v+1],v2=tdata[v+2];
	if(v1!==-1){
		if(block3xx_same.includes(blocktype)){
			if(tdata[tnode[v1]]===blocktype){
				warn(300,"重复的积木",id);
			}
		}

		if(block3xx_same1.includes(blocktype)){
			var id2=tnode[v1];
			if(tdata[id2]===blocktype){
				if(tdata[tnode[tdata[id2]]+1]
					===tdata[tnode[tdata[id]]+1]){
					warn(301,"重复的积木",id);
				}
			}
		}

		if(block3xx_same2.includes(blocktype)){
			var id2=tnode[v1];
			if(tdata[id2]===blocktype){
				if(tdata[tnode[tdata[id2]]+2]
					===tdata[tnode[tdata[id]]+2]){
					warn(302,"重复的积木",id);
				}
			}
		}
	}

	switch(blocktype){
		case 'control_create_clone_of_menu':
			DEBUG("w310p",tdata[v+2]);
			if(checkvalue(v+2,"_myself_",'===')){
				DEBUG("w310",tdata[tnode[fromhead]]);
				if(tdata[tnode[fromhead]]==='control_start_as_clone'){
					//这里要检测if
					var check=0;
					for(var j=0;j<blockstack.length;j++){
						DEBUG("w310if",tdata[tnode[blockstack[j]]]);
						if(
							tdata[tnode[blockstack[j]]]==='control_if'
							|| tdata[tnode[blockstack[j]]]==='control_if_else'
						){
							DEBUG("w310ch",tdata[tnode[blockstack[j]]+2]);
							if(checkblock(tdata[tnode[blockstack[j]]+2],"spritevarlist")){
								check=1;
							}
						}
					}
					if(check===0){
						warn(310,"克隆时没有角色变量条件控制",id);
					}
				}
			}
			break;
		case 'control_delete_this_clone':
			for(var j=0;j<blockstack.length;j++){
				if(tdata[tnode[blockstack[j]]+1]!==-1){
					warn(311,"删除克隆体积木后仍有可执行积木",id);
					warn(311,"在这里:",tdata[tnode[blockstack[j]]+1]);
				}
			}
			/* fall through */
		case 'control_stop':
			if(tdata[tnode[v2]]==="other scripts in sprite"){
				break;
			}
			if(blockstack.length===0){
				warn(312,"停止当前积木/删除此克隆体所处的位置不正确",id);
			}else{
				var j=blockstack[blockstack.length-1];
				DEBUG("w312",j,tdata[tnode[j]]);
				if(
					!(
						tdata[tnode[j]]==='control_if'
						|| tdata[tnode[j]]==='control_if_else'
					)
				){
					warn(312,"停止当前积木/删除此克隆体所处的位置不正确",id);
				}
			}
			break;
		case 'operator_not':
			for(var j=0;j<blockstack.length;j++){
				if(tdata[tnode[blockstack[j]]]==="operator_not"){
					warn(320,"“不成立”积木重复使用",id);
				}
			}
			break;
		case 'operator_equals':
			if(checkvalue(tnode[id]+2,0,'float')
			|| checkvalue(tnode[id]+3,0,'float')){
				warn(330,"用等号比较小数",id);
			}
			if(checkvalue(tnode[id]+2,0,'capital')
			|| checkvalue(tnode[id]+3,0,'capital')){
				warn(331,"比较大写字母",id);
			}
			break;
	}
}

function checkblock(i,operator){
	DEBUG("checkblock",i,operator);
	if(i!==-1){
		var check=tnode[i];
		switch(operator){
			case 'spritevarlist':
				DEBUG("checktype",tdata[check]);
				switch(tdata[check]){
					case '[变量]':
						DEBUG("checkblockvar",tdata[check+1],varilist);
						if(varilist.includes(tdata[check+1])){
							return true;
						}
						break;
					case '[列表]':
						DEBUG("checkblocklist",tdata[check+1],listlist);
						if(listlist.includes(tdata[check+1])){
							return true;
						}
						break;
					default:
						DEBUG("checkblockref",tdata[check]);
						if(block1xx_listref.includes(tdata[check])){
							DEBUG("checkblockref",tnode[tdata[check+3]],tdata[tnode[tdata[check+3]]+1],listlist);
							if(listlist.includes(tdata[tnode[tdata[check+3]]+1])){
								return true;
							}
						}
				}
				break;
			case 'spriterefs':
				if(block4xx_spriteref.includes(tdata[check])){
					return true;
				}
				break;
			default:
				throw new Error("无效的操作 "+operator);
		}
		if(tdata[check][0] !== '['){
			var j=0;
			if(tdata[check] === 'procedures_definition' || tdata[check] === 'procedures_call'){
				j=1;
			}
			DEBUG("checkblockSub",check+1,tnode[i+1]-j);
			for(var k=check+1;k<tnode[i+1]-j;k++){
				if(checkblock(tdata[k],operator)){
					return true;
				}
			}
		}
	}
	return false;
}

function checkvalue(i,value,operator){
	DEBUG("checkvalue",i,value,operator);
	if(tdata[i]!==-1){
		var check=tnode[tdata[i]];
		DEBUG("check1",check,tdata[check]);
		if(tdata[check]==="[文本]"||tdata[check]==="[选项]"){
			DEBUG("check",tdata[check+1]);
			if(String(tdata[check+1])===""){
				//考虑Number("")===0的特殊情况
				return value==="" && operator==="===";
			}else{
				switch(operator){
					case '<':
						if(Number(tdata[check+1])<value){
							return true;
						}
						break;
					case '>':
						if(Number(tdata[check+1])>value){
							return true;
						}
						break;
					case '==':
						if(Number(tdata[check+1])===value){
							return true;
						}
						break;
					case '===':
						if(String(tdata[check+1])===value){
							return true;
						}
						break;
					case 'number':
						if(String(Number(tdata[check+1]))===tdata[check+1]){
							return true;
						}
						break;
					case 'float':
						if(String(Number(tdata[check+1]))===tdata[check+1]){
							if(String(Math.floor(Number(tdata[check+1])))!==tdata[check+1]){
								return true;
							}
						}
					case 'capital':
						var str=tdata[check+1];
						for(var i=0;i<str.length;i++){
							if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(str[i])){
								return true;
							}
						}
						return false;
						break;
					case 'nonumber':
						if(String(Number(tdata[check+1]))!==tdata[check+1]){
							return true;
						}
						break;
					default:
						throw new Error("无效的operator: "+operator);
						break;
				}
			}
		}
	}
	return false;
}

function warn(errid,errtext,fromblock){
	checkdata.push(errid);
	checkdata.push(errtext);
	checkdata.push(fromblock);
	checkdata.push(fromproj);
	checkdata.push(fromspri);
	checkdata.push(fromhead);
}

SAE.check.debug = function debug(){
	checkdata = SAE.check.data;
	DEBUG(checkdata);
	for(var i=0;i<checkdata.length;i+=6){
		if(checkdata[i]>100){
			console.log("问题 "+checkdata[i]+": "+checkdata[i+1]);
			console.log("作品 "+checkdata[i+3]+", 角色 "+tdata[tnode[checkdata[i+4]]],", 积木 "+checkdata[i+5]);
			var cl=SAE.disp.block(checkdata[i+5],checkdata[i+2]);
			if(cl===-1){
				console.log("无法显示预览");
			}else{
				var j=cl;
				if(j>SAE.disp.data.length-5){
					j=SAE.disp.data.length-5;
				}
				if(j<4){j=4;}
				DEBUG(cl,j,k,SAE.disp.data);
				for(var k=-4;k<5;k++){
					if(j+k>=SAE.disp.data.length){
						console.log("       |");
					}else{
						if(j+k===cl){
							console.log(('> '+(j+k)+'     ').slice(0,7)+'| '+SAE.disp.data[j+k]);
						}else{
							console.log(('  '+(j+k)+'     ').slice(0,7)+'| '+SAE.disp.data[j+k]);
						}
					}
				}
			}
			console.log("--------------------------------------------------------------------------------");
		}
	}
}

function zeroarray(n){
	return Array(n).fill(0);
}

function DEBUG(...args){
	//console.log.apply(console,arguments);
}
})();
