SAE = SAE || {};

SAE.check = SAE.check || {};

// check检查
(function(){
"use strict";
/*{{{*/
/*{{{*/

var tnode,tdata,checkdata,isstage;
var fromhead,fromproj,fromspri;
var costlist,soundlist,stagevarilist,stagelistlist,varilist,listlist,defslist,argslist,argblist;
var costfile,soundfile,                                              defsposi;
var                    stagevariused,stagelistused,variused,listused,defsused,argsused,argbused;

SAE.check.proj = function proj(id){
	tnode = SAE.data.tnode;
	tdata = SAE.data.tdata;

	SAE.check.data = [];
	checkdata = SAE.check.data;

	fromproj = id;

	tnode.push(tdata.length);

	//

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

	// TODO: example
	for(var i=0;i<stagelistused.length;i++){
		if(stagelistused[i] === 0){
			warn(122,"未使用的全局列表: " + stagelistlist[i],id);
		}
	}

	tnode.pop();
}

function spri(id){
	fromspri = id;

	costlist = load(tdata[tnode[id]+1]);
	soundlist = load(tdata[tnode[id]+2]);
	if(isstage){
		stagevarilist = load(tdata[tnode[id]+3]);
		stagelistlist = load(tdata[tnode[id]+4]);
		stagevariused = zeroarray(stagevarilist.length);
		stagelistused = zeroarray(stagelistlist.length);
		varilist = [];
		listlist = [];
	}else{
		varilist = load(tdata[tnode[id]+3]);
		listlist = load(tdata[tnode[id]+4]);
	}
	defslist = load(tdata[tnode[id]+5],defsposi);

	variused = zeroarray(varilist.length);
	listused = zeroarray(listlist.length);
	defsused = zeroarray(defslist.length);

	blocklist(tdata[tnode[id]+6]);

	for(var i=0;i<variused.length;i++){
		if(variused[i] === 0){
			warn(111,"未使用的变量: " + varilist[i],id);
		}
	}

	// TODO: example
	for(var i=0;i<listused.length;i++){
		if(listused[i] === 0){
			warn(121,"未使用的列表: " + listlist[i],id);
		}
	}

	//由于定义积木列表奇数项是积木名，偶数项是积木的位置，所以这里需要+2
	// TODO
	for(var i=0;i<defsused.length;i+=2){
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
	warn(1,"blockstart",id);
	DEBUG("blockstart",id);

	argslist=[];
	argsused=[];
	argblist=[];
	argbused=[];

	var blocktype=tdata[tnode[id]];
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
	var blocktype=tdata[tnode[id]];
	warn(2,"block: " + blocktype,id);
	var j=0;
	switch(blocktype){
		case 'procedures_definition':
			j=1;
			break;

			//下面的重复内容主要是考虑到特殊情况下不同的内容可能会区别对待
		case 'procedures_call':
			j=1;
			var i=defslist.indexOf(tdata[tnode[id]+1]);
			if(i===-1){
				warn(140,"积木未定义",id);
			}else{
				defsused[i]=1;
			}
			break;

		case '[变量]':
			// TODO: 公用变量，列表
			var i=varilist.indexOf(tdata[tnode[id]+1]);
			if(i===-1){
				var i=stagevarilist.indexOf(tdata[tnode[id]+1]);
				if(i===-1){
					warn(110,"变量不在变量列表中",id);
				}else{
					stagevariused[i]=1;
				}
			}else{
				variused[i]=1;
			}
			break;

		case '[列表]':
			var i=listlist.indexOf(tdata[tnode[id]+1]);
			if(i===-1){
				var i=stagelistlist.indexOf(tdata[tnode[id]+1]);
				if(i===-1){
					warn(120,"列表不在列表列表中",id);
				}else{
					stagelistused[i]=1;
				}
			}else{
				listused[i]=1;
			}
			break;

		case '[参数]':
			var i=argslist.indexOf(tdata[tnode[id]+1]);
			if(i===-1){
				warn(130,"参数没在积木定义中出现",id);
			}else{
				argsused[i]=1;
			}
			break;

		case '[布尔参数]':
			var i=argblist.indexOf(tdata[tnode[id]+1]);
			if(i===-1){
				warn(132,"布尔参数没在积木定义中出现",id);
			}else{
				argbused[i]=1;
			}
			break;

		default:
			break;
	}

	DEBUG("bl",id);
	DEBUG("block",id,blocktype[0]);

	if(blocktype[0] !== '['){
		for(var i=tnode[id]+2;i<tnode[id+1]-j;i++){
			if(tdata[i]!==-1){
				DEBUG("block1",tdata[i]);
				block(tdata[i]);
			}
		}
		if(tdata[tnode[id]+1]!==-1){
			DEBUG("check next",id,tnode[id],tdata[tnode[id]+1]);
			block(tdata[tnode[id]+1]);
		}
	}
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
						console.log("");
					}else{
						if(j+k===cl){
							console.log(('['+(j+k)+']      ').slice(0,8)+'|'+SAE.disp.data[j+k]);
						}else{
							console.log((' '+(j+k)+'       ').slice(0,8)+'|'+SAE.disp.data[j+k]);
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

function DEBUG(){
	//console.log.apply(console,arguments);
}
/*}}}*/
})();
