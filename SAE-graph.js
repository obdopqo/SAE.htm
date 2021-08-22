// graph绘图
(function(){
"use strict";

var tnode,tdata;

SAE.graph.lines = [];

function graphinit(){
	SAE.graph.lines=[];
}

SAE.graph.proj = function graphproj(id){
	tnode=SAE.data.tnode;
	tdata=SAE.data.tdata;
	graphinit();
	tnode.push(tdata.length);
	proj(id);
	tnode.pop();
}

function proj(id){
	DEBUG("proj",id,tnode[id],tnode[id+1]);
	for(var i=tnode[id];i<tnode[id+1];i++){
		DEBUG("proj",i,tdata[i]);
		spri(tdata[i]);
	}
}

function spri(id){
	var i=tnode[id];
	blocklist(id,tdata[i+6]);
}

function blocklist(spid,id){
	for(var i=tnode[id];i<tnode[id+1];i++){
		var j=ghead(spid,tdata[i]);
		if(SAE.options.graph.noBlockId){
			if(j!==""){
				block(spid,j,tdata[i]);
			}
		}else{
			if(j!==""){
				SAE.graph.lines.push(j);
				SAE.graph.lines.push("#"+spid+":"+tdata[i]);
			}
			block(spid,"#"+spid+":"+tdata[i],tdata[i]);
		}
	}
}

function block(spid,head,id){
	if(id!==-1){
		// 积木类型
		var blocktype=tdata[tnode[id]];
		DEBUG("blocktype",id,blocktype);
		if(blocktype.slice(0,1)!=="["){
			//不是输入积木
			var j=gblock(spid,id);
			if(j!==""){
				SAE.graph.lines.push(head);
				SAE.graph.lines.push(j);
			}
			var i=tnode[id]+1;
			j=tnode[id+1];
			if(blocktype==="procedures_call"
			|| blocktype==="procedures_definition"){
				j--;
			}
			while(i<j){
				DEBUG("tdata",i,j,tdata[i]);
				block(spid,head,tdata[i]);
				i++;
			}
		}
	}
}

function ghead(spid,id){
	var blocktype=tdata[tnode[id]];
	switch(blocktype){
		case "event_whenflagclicked":
			return "F";
		case "event_whenstageclicked":
			return "S";
		case "event_whenthisspriteclicked":
			return "C"+tdata[tnode[spid]];
		case "event_whenkeypressed":
			return "K"+tdata[tnode[tdata[tnode[id]+2]]+1];
		case "control_start_as_clone":
			return "O"+tdata[tnode[spid]];
		case "event_whenbackdropswitchesto":
			return "D"+tdata[tnode[tdata[tnode[id]+2]]+1];
		case "event_whenbroadcastreceived":
			return "B"+tdata[tnode[tdata[tnode[id]+2]]+1];
		case "procedures_definition":
			return "P"+spid+":"+tdata[tnode[id+1]-1];
		default:
			if(blocktype.includes("_when")){
				return blocktype;
			}else{
				return "";
			}
	}
}

function gblock(spid,id){
	var blocktype=tdata[tnode[id]];
	switch(blocktype){
		case "control_create_clone_of":
			// TODO: 判断里边的内容
			return expand("O","control_create_clone_of_menu",tdata[tnode[id]+2],tdata[tnode[spid]]);
		case "looks_switchbackdropto":
		case "looks_switchbackdroptoandwait":
			// TODO: 判断里边的内容
			return expand("D","looks_backdrops",tdata[tnode[id]+2],null);
		case "event_broadcast":
		case "event_broadcastandwait":
			// TODO: 判断里边的内容
			var check=tdata[tnode[id]+2];
			if(check===-1||tdata[tnode[check]]!=="[文本]"){
				return "";
			}else{
				return "B"+tdata[tnode[check]+1];
			}
		case "procedures_call":
			return "P"+spid+":"+tdata[tnode[id+1]-1];
		default:
			break;
	}
	return "";
}

function expand(type,inblockop,id,spname){
	if(id===-1||tdata[tnode[id]]!==inblockop){
		return "";
	}else{
		var check=tdata[tnode[id]+2];
		if(check===-1||tdata[tnode[check]]!=="[选项]"){
			return "";
		}else{
			if(spname!==null&&tdata[tnode[check]+1]==="_myself_"){
				return type+spname;
			}else{
				return type+tdata[tnode[check]+1];
			}
		}
	}
}

SAE.graph.debug = function debug(){
	var lines=SAE.graph.lines;
	var tagname=[];
	var tagline=[];
	var tagdisp=[];
	var tagposi=[];
	var tagnums=[];
	var gettagnamelist = function gtagnamelist(name){
		if(!tagname.includes(name)){
			tagname.push(name);
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
		/*
		if(tagname.includes(lines[i])){
			tagline.push(tagname.indexOf(lines[i]));
		}else{
			tagline.push(tagname.length);
			tagname.push(lines[i]);
		}
		*/
	}
	DEBUG("tagname",tagname);
	for(var i=0;i<lines.length;i++){
		if(tagname.includes(lines[i])){
			tagline.push(tagname.indexOf(lines[i]));
		}else{
			tagline.push(-1);
		}
	}
	DEBUG("tagline",tagline);
	var column=0;
	for(var i=0;i<tagline.length;i+=2){
		var y1=tagline[i+0];
		var y2=tagline[i+1];
		if(y1!==-1&&y2!==-1){
			if(y1>y2){
				var t=y1;
				y1=y2;
				y2=t;
			}
			if(!tagnums.includes(y1*10000+y2)){
				tagnums.push(y1*10000+y2);
				var j=0;
				var enable=false;
				while(j<tagposi.length&&!enable){
					enable=true;
					while(j<tagposi.length&&tagposi[j]!==-1){
						if(tagposi[j+0]<y2&&tagposi[j+1]>y1){
							enable=false;
						}
						j+=2;
					}
					if(enable){
						tagposi.splice(j,0,y1,y2);
						DEBUG("YES",tagposi,column);
					}else{
						j+=2;
					}
				}
				if(!enable){
					tagposi.push(y1);
					tagposi.push(y2);
					tagposi.push(-1);
					tagposi.push(-1);
					DEBUG("NO ",tagposi,column);
					column++;
				}
			}
		}
	}
	DEBUG("tagposi",tagposi,column);
	for(var y=0;y<tagname.length;y++){
		tagdisp.push([]);
		for(var x=0;x<column*2;x++){
			tagdisp[y].push(" ");
		}
	}
	var col=-2;
	for(var i=tagposi.length-2;i>=0;i-=2){
		var y1=tagposi[i+0];
		var y2=tagposi[i+1];
		if(y1!==-1&&y2!==-1){
			tagdisp[y1][col]=">\\".includes(tagdisp[y1][col])?">":"/";
			tagdisp[y2][col]=">/".includes(tagdisp[y2][col])?">":"\\";
			for(var j=col+1;j<column*2;j++){
				tagdisp[y1][j]="|+".includes(tagdisp[y1][j])?"+":"-";
				tagdisp[y2][j]="|+".includes(tagdisp[y2][j])?"+":"-";
			}
			for(var j=y1+1;j<y2;j++){
				tagdisp[j][col]="-+".includes(tagdisp[j][col])?"+":"|";
			}
		}else{
			col+=2;
		}
	}
	for(var y=0;y<tagname.length;y++){
		console.log(tagdisp[y].join("")+tagname[y]);
	}
}

SAE.graph.debugnum = function debugnum(){
	var lines=SAE.graph.lines;
	var tagname=[];
	var tagline=[];
	var tagnums=[];
	var gettagnamelist = function gtagnamelist(name){
		if(!tagname.includes(name)){
			tagname.push(name);
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
	}
	console.log(tagname.length);
	for(var i=0;i<lines.length;i++){
		if(tagname.includes(lines[i])){
			tagline.push(tagname.indexOf(lines[i]));
		}else{
			tagline.push(-1);
		}
	}
	for(var i=0;i<tagline.length;i+=2){
		var y1=tagline[i+0];
		var y2=tagline[i+1];
		if(y1!==-1&&y2!==-1){
			if(y1>y2){
				var t=y1;
				y1=y2;
				y2=t;
			}
			if(!tagnums.includes(y1*10000+y2)){
				tagnums.push(y1*10000+y2);
				console.log(y1);
				console.log(y2);
			}
		}
	}
}

function DEBUG(...args){
	//console.log.apply(console,arguments);
}
})();
