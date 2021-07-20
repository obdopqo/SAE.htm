SAE = SAE || {};

SAE.check = SAE.check || {};

// check检查
(function(){
"use strict";
/*{{{*/
/*{{{*/

var tnode,tdata,checkdata,isstage;
var fromhead,fromproj,fromspri;
var costlist,soundlist,stagevarilist,stagelistlist,varilist,listlist,defslist;
var                    stagevariused,stagelistused,variused,listused,defsused;

SAE.check.proj = function proj(id){
	tnode = SAE.data.tnode;
	tdata = SAE.data.tdata;

	SAE.check.data = [];
	checkdata = SAE.check.data;

	fromproj = id;

	tnode.push(tdata.length);

	//

	isstage=1;
	//console.log(tnode[id],tnode[id+1]);
	for(var i=tnode[id];i<tnode[id+1];i++){
		// 这里假设第一个就是舞台
		spri(tdata[i]);
		isstage=0;
	}

	//

	tnode.pop();
}

function spri(id){
	fromspri = id;

	costlist = load(tdata[tnode[id]+1]);
	soundlist = load(tdata[tnode[id]+2]);
	if(isstage){
		stagevarilist = load(tdata[tnode[id]+3]);
		stagelistlist = load(tdata[tnode[id]+4]);
	stagevariused = Array(stagevarilist.length);
	stagelistused = Array(stagelistlist.length);
		varilist = [];
		listlist = [];
	}else{
		varilist = load(tdata[tnode[id]+3]);
		listlist = load(tdata[tnode[id]+4]);
	}
	defslist = load(tdata[tnode[id]+5]);

	variused = Array(varilist.length);
	listused = Array(listlist.length);
	defsused = Array(defslist.length);

	blocklist(tdata[tnode[id]+6]);

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
		//console.log("blocklist",i,tdata[i]);
		blockstart(tdata[i]);
	}
}

function blockstart(id){
	// 这里的fromhead是全局变量，意味着接下来的调用中fromhead就是积木id的头积木。
	// 有一个例外，就是追踪引用的时候可能会跳转到积木定义中，这是积木定义就会变成头积木
	fromhead = id;
	warn(1,"blockstart",id);
	//console.log("blockstart",id);
	var blocktype=tdata[tnode[id]];
	switch(blocktype){
		case 'procedures_definition':
			//记录使用的参数
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
}

function block(id){
	console.log("block st",id);
	var blocktype=tdata[tnode[id]];
	warn(2,"block: " + blocktype,id);
	var j=0;
	switch(blocktype){
		case 'procedures_definition':
			j=1;
			break;
		case 'procedures_call':
			j=1;
			var i=defslist.indexOf(tdata[tnode[i]]);
			if(i===-1){
				warn(130,"积木未定义",i);
			}else{
				defsused[i]=1;
			}
			break;

		case '[变量]':
			var i=varilist.indexOf(tdata[tnode[i]]);
			if(i===-1){
				warn(110,"变量不在变量列表中",i);
			}else{
				variused[i]=1;
			}
			break;
		default:
			break;
	}
	console.log("bl",id);
	console.log("block",id,blocktype[0]);
	if(blocktype[0] !== '['){
		for(var i=tnode[id]+2;i<tnode[id+1]-j;i++){
			if(tdata[i]!==-1){
				console.log("block1",tdata[i]);
				block(tdata[i]);
			}
		}
		if(tdata[tnode[id]+1]!==-1){
			console.log("check next",id,tnode[id],tdata[tnode[id]+1]);
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
	console.log(checkdata);
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
				//console.log(cl,j,k,SAE.disp.data);
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

////////

function jcbl(blwz,ii){
	jcblgs=sjmz[blwz];
	jcblmz=[];
	jcblsy=[];
	i=sjwz[blwz];
	while(i<sjwz[blwz+1]){
		jcblmz.push(sjsz[i]);
		jcblsy.push(0);
		i++;
	}
	if(jcwt===1){
		jcwtgs=jcblgs;
		j=0;
		while(j<jcblmz.length){
			jcwtmz.push(jcblmz[j]);
			jcwtsy.push(jcblsy[j]);
			j++;
		}
	}
	i=ii;
}
function jcdy(blwz,ii){
	jcdymz=[];
	jcdywz=[];
	jcdysy=[];
	jcdyxhsy=[];
	jcdyyb=[];
	i=sjwz[blwz];
	while(i<sjwz[blwz+1]){
		jcdymz.push(sjsz[i]);
		jcdywz.push(sjsz[i+1]);
		jcdysy.push(0);
		jcdyyb.push(0);
		i+=2;
	}
	i=ii;
}
/*}}}*/
// jcjm检查积木
/*{{{*/
function jcjm(jmwz,ii){
	//print("  "+"jm"+jmwz);
	jcjgyb=[];
	i=sjwz[jmwz];
	while(i<sjwz[jmwz+1]){
		jcjmktdq=sjsz[i];
		jcjmyb=0;
		jcjmlb=[];
		try{
			jcjmktks(jcjmktdq,i);
		}catch(err){
			errHandle(jcjmktdq,err);
		}
		jcjm0(jcjmktdq,i,j);
		try{
			jcjmktjs(jcjmktdq,i);
		}catch(err){
			errHandle(jcjmktdq,err);
		}
		i++;
	}
	jg=1;
	while(jg===1){
		i=0;
		jg=0;
		while(i<jcdyxhsy.length){
			if(jcdyyb[jcdyxhsy[i+0]]===1
			&& jcdyyb[jcdyxhsy[i+1]]!==1){
				jcdyyb[jcdyxhsy[i+1]]=1;
				jg=1;
			}
			i+=2;
		}
	}
	i=0;
	while(i<jcjgyb.length){
		if(jcdyyb[jcjgyb[i+1]]===1){
			jcjgzj1(jcjgyb[i+2],jcjgyb[i+0],jcjgyb[i+3]);
			jcjgzj1(jcdywz[jcjgyb[i+1]],jcjgyb[i+0],":可能会被一步执行的积木");
		}
		i+=4;
	}
	i=ii;
}
function jcjm0(jmwz,ii,jj){
	if(jmwz>0&&jmwz<=1000000){
		//print("jcjm0[i]",sjmz[jmwz],jmwz)
		jcjmlxdq=sjmz[jmwz];
		try{
			jcjmdg(jmwz,sjwz[jmwz],sjwz[jmwz+1]);
		}catch(err){
			errHandle(jmwz,err);
		}
		if(jcjmlxdq==="procedures_call"||jcjmlxdq==="procedures_prototype"){
			i=sjwz[jmwz+1];
			jcjmdy(jmwz);
		}else{
			jcjm1(jmwz);
		}
		i=sjsz[sjwz[jmwz]];
		if(i!==0){
			//print("sjwz[i]",sjwz[jmwz],i)
			jcjm0(i,i,j);// !!! optimize
		}
	}else{
		if(jmwz>1000000&&jmwz<=2000000){
			jcblsy[jmwz-1000001]=1;
		}else{
			if(jmwz<-1000000&&jmwz>=-2000000){
				jcwtsy[-jmwz-1000001]=1;
			}
		}
	}
	i=ii;
	j=jj;
}
function jcjmbl(jmwz){
	//print(jcjmlxdq,jmwz)
	if(jmwz>0){
		jcblsy[jmwz-2000001]=1;
	}else{
		jcwtsy[-jmwz-2000001]=1;
	}
}
function jcjm1(jmwz){
	//print("i",i,sjwz[i],sjwz[i+1])
	if(sjmz[jmwz]==="control_all_at_once"){
		jcjmyb++;
	}
	jcjmlb.push(jmwz);
	i=sjwz[jmwz]+1;
	while(i<sjwz[jmwz+1]){
		//print("i",i,sjsz[i])
		jcjmlb.push(i-sjwz[jmwz]);
		jcjm0(sjsz[i],i,j);
		jcjmlb.pop();
		i++;
	}
	if(sjmz[jmwz]==="control_all_at_once"){
		jcjmyb--;
	}
	jcjmlb.pop();
}
function jcjmdy(jmwz){
	//print(jmmb)
	i=sjsz[sjwz[jmwz+1]-1]-3000001;
	i=sjwz[jmwz]+1;
	while(i<sjwz[jmwz+1]-1){
		if(sjsz[i]===0){
			jcjgzj(jmwz,"1缺少积木");
		}
		jcjm0(sjsz[i],i,j);
		i++;
	}
}
/*}}}*/
// jcjg检查结果
/*{{{*/
function jcjgzj(jmwz,wb){
	jcjgzj1(jmwz,jcjmktdq,wb);
}
function jcjgzj1(jmwz,jmkt,wb){
	jcjg.push(jcwjwzdq);
	jcjg.push(jcjswzdq);
	jcjg.push(jmkt);
	jcjg.push(jmwz);
	jcjg.push(wb);
}
function jcjgzjyb(jmwz,wb){
	if(jcjmyb!==0){
		jg=jcjmktdq;
		i=2;
		while(i<jcjmlb.length){
			if(sjmz[jcjmlb[i]]==="control_all_at_once"){
				jg=jmwz;
			}
			i+=2;
		}
		jcjgzj(jmwz,wb);
		jcjgzj(jg,":一步执行的积木");
	}else{
		if(jcdywzdq!==-1){
			jcjgyb.push(jcjmktdq);
			jcjgyb.push(jcdywzdq);
			jcjgyb.push(jmwz);
			jcjgyb.push(wb);
		}
	}
}
function jcjgzj2(wb,sm){
	jcjg.push(jcwjwzdq);
	jcjg.push(jcjswzdq);
	jcjg.push("");
	jcjg.push(sm);
	jcjg.push(wb);
}
function jcjgxs(){
	i=0;
	while(i<jcjg.length){
		print("文件 "+sjmz[jcjg[i+0]]);
		print("角色 "+sjmz[jcjg[i+1]]);
		if(jcjg[i+2]===""){
			print(jcjg[i+4]+":"+jcjg[i+3]);
		}else{
			//print("  积木 "+sjmz[jcjg[i+2]]);
			//print("  积木 "+sjmz[jcjg[i+3]]);
			print(jcjg[i+4]);
			print("");
			xswj(jcjg[i+0],i,false);
			xsjs(jcjg[i+1],i,false);
			xsjmwz=jcjg[i+3];
			xsjmjg=-1;
			xsjg=[];
			xsjg.push("");
			xsjm0(jcjg[i+2],"",'@',0,i,j);
			if(xsjmjg===-1){
				print("(无法查看预览)");
			}else{
				j=xsjmjg-5;
				if(j>xsjg.length-11){
					j=xsjg.length-11;
				}
				if(j<0){
					j=0;
				}
				m=0;
				while(m<11&&j+m<xsjg.length){
					if(j+m===xsjmjg){
						print(("["+String(j+m)+"]........").slice(0,8)+xsjg[j+m]);
					}else{
						print(("."+String(j+m)+"........").slice(0,8)+xsjg[j+m]);
					}
					m++;
				}
			}
		}
		i+=5;
		print("");
		print("");
	}
}
/*}}}*/
/*}}}*/
/*}}}*/
// 自定义规则
/*{{{*/
/*{{{*/
//检查一组积木开始时调用
function jcjmktks(jmwz,ii){
	jcjmcsbj=[];
	jcjmcssy=[];
	if(jmwz>0&&jmwz<=1000000){
		if(sjmz[jmwz]==="procedures_definition"){
			if(!includes(jcdywz,jmwz)){
				//print(jcdywz,jmwz)
				jcjgzj(jmwz,"0重复的积木定义");
			}
			i=sjsz[sjwz[jmwz]+1];
			if(i>0&&i<=1000000){
				j=sjwz[i]+1;
				while(j<sjwz[i+1]-1){
					//print(m,j,i,sjwz[i],sjwz[i+1],sjsz[j])
					m=sjmz[sjsz[j]];
					if(m==="argument_reporter_string_number"){
						m=sjsz[sjwz[sjsz[j]]+1];
						clwbdx(sjwb[-m-1]);
						//print(jmwz,j,jg,jcjmcsbj)
						jcjmcsbj.push("S"+jg);
						jcjmcssy.push(0);
					}
					if(m==="argument_reporter_boolean"){
						m=sjsz[sjwz[sjsz[j]]+1];
						clwbdx(sjwb[-m-1]);
						//print(jmwz,j,jg,jcjmcsbj)
						jcjmcsbj.push("B"+jg);
						jcjmcssy.push(0);
					}
					j++;
				}
				i=sjsz[sjwz[i+1]-1];
				if(i>3000000){
					i-=3000001;
					if(jcdywz[i]<0){
						jcjmyb++;
					}
					jcdywzdq=i;
				}
			}
		}else{
			jcdywzdq=-1;
			if(!contains(sjmz[jmwz],"_when")
			&& sjmz[jmwz]!=="control_start_as_clone"
			|| sjsz[sjwz[jmwz]]===0){
				jcjgzj(jmwz,"0未拼合的积木");
			}
		}
	}
	i=ii;
}
//检查一组积木结束时调用
function jcjmktjs(jmwz,ii){
	if(jcdywzdq!==-1){
		i=0;
		j=sjsz[sjwz[jmwz]+1];
		j=sjwz[j]+1;
		//print(jcjmcsbj)
		while(i<jcjmcssy.length){
			if(jcjmcssy[i]===1){
				m=sjsz[sjwz[sjsz[j]]+1];
				jcjgzj(jcjmktdq,"3有自定义参数没被使用:"+sjwb[-m-1]);
			}
			i++;
			j++;
		}
	}
	i=ii;
}
//检查单个积木时调用srks输入开始srjs输入结束
function jcjmdg(jmwz,srks,srjs){
	jcjm00(jmwz,srks,srjs);
	jcjm01(jmwz,srks,srjs);
	jcjm02(jmwz,srks,srjs);
	jcjm03(jmwz,srks,srjs);
	jcjm04(jmwz,srks,srjs);
}
//参数 定义 等待 判断
function jcjm00(jmwz,srks,srjs){
	//print(jcjmlxdq)
	if(sjts[jmwz]!==""){
		jcjgzj(jmwz,sjts[jmwz]);
	}
	if(jcjmlxdq==="argument_reporter_string_number"){
		m=sjsz[srks+1];
		clwbdx(sjwb[-m-1]);
		i=indexof(jcjmcsbj,"S"+jg);
		if(i===-1){
			jcjgzj(jmwz,"3意外的参数");
		}else{
			jcjmcssy[i]++;
		}
	}
	if(jcjmlxdq==="argument_reporter_boolean"){
		m=sjsz[srks+1];
		clwbdx(sjwb[-m-1]);
		i=indexof(jcjmcsbj,"B"+jg);
		if(i===-1){
			jcjgzj(jmwz,"3意外的参数");
		}else{
			jcjmcssy[i]++;
		}
	}
	i=indexof(jcjm0001,jcjmlxdq);
	if(i>-1){
		if(i<5){
			jcjmbl(sjsz[srjs-1]);
		}else{
			jcjmbl(sjsz[srjs-2]);
		}
	}
	if(jcjmlxdq==="procedures_call"){
		i=sjsz[sjwz[jmwz+1]-1]-3000001;
		//print("jcdysy",i,jcdysy,jcdymz[i])
		jcdysy[i]=1;
		if(jcdywz[i]===0){
			jcjgzj(jmwz,"0找不到积木定义");
		}else{
			if(jcjmyb!==0){
				jcdyyb[i]=1;
			}
			if(jcdywzdq!==-1){
				jcdyxhsy.push(jcdywzdq);
				jcdyxhsy.push(i);
			}
		}
	}
	if(contains(jcjmlxdq.toLowerCase(),"wait")
	|| includes(jcjm0004,jcjmlxdq)){
		jcjgzjyb(jmwz,"2在一步执行中使用等待积木");
		return;
	}
	if(!includes(jcjm0003,sjmz[jmwz])){
		i=srks+1;
		while(i<srjs){
			m=sjsz[i];
			if(m>0&&m<=1000000){
				if(includes(jcjm0002,sjmz[m])){
					jcjgzj(m,"2可能放错位置的判断积木");
				}
			}
			i++;
		}
	}
}
//相同 无意义
function jcjm01(jmwz,srks,srjs){
	//print(require("util").inspect(String,true,null))
	j=indexof(jcjm0101,jcjmlxdq);
	if(j!==-1){
		if(j%5===2||j%5===3){
			jg=sjsz[srks+1];
			if(jg>0&&jg<=1000000){
				if("#"+sjmz[jg]===jcjm0101[j-2]){
					jcjgzj(jmwz,"2无意义的积木");
				}
			}
		}
		if(j%5===1||j%5===4){
			jcjmsrsz(jmwz,sjsz[srks+1],"0","2无意义的积木");
		}
		i=jmwz;
		while(true){
			if(sjsz[sjwz[i]]===0){
				return;
			}
			jg=jcjm0101[Math.floor(j/5)*5];
			if(jg==="#v"){
				jcjmssjm(i,sjsz[srks+2]-1000000,true,i);
				if(jg!==0){
					return;
				}
			}else{
				if(jg!=="#"&&jg!=="#!"){
					jcjmssjm(i,jg,true,i);
					if(jg!==0){
						return;
					}
				}
			}
			i=sjsz[sjwz[i]];
			m=indexof(jcjm0101,sjmz[i]);
			if(m===-1){
				if(!includes(jcjm0102,sjmz[i])){
					return;
				}
			}else{
				jg=0;
				if(Math.floor(j/5)===Math.floor(m/5)){
					jg=1;
					if(jcjm0101[Math.floor(j/5)*5]==="#v"){
						//print(j,m,i,sjsz[sjwz[i]+2],sjsz[srks+2])
						if(sjsz[sjwz[i]+2]!==sjsz[srks+2]){
							jg=0;
						}
					}else{
						if(jcjm0101[Math.floor(j/5)*5]==="#!"){
							if(j%5<=2 && m%5<=2){
								//print(j,m,i,sjwb[-sjsz[sjwz[i]+2]-1],sjwb[-sjsz[srks+2]-1])
								if(sjwb[-sjsz[sjwz[i]+2]-1]
								!==sjwb[-sjsz[srks+2]-1]){
									jg=0;
								}
							}
						}
					}
					if(j%5===3&&(m%5===1||m%5===4)){
						jg=0;
					}
				}else{
					if(j<5&&m<15||j<15&&m<5){
						jg=1;
					}
				}
			}
			if(jg===1){
				jcjgzj(jmwz,"3相同功能的积木");
				jcjgzj(i,":和这个相同");
				return;
			}
		}
	}else{
		j=indexof(jcjm0102,jcjmlxdq);
		if(j!==-1){
			i=jmwz;
			while(true){
				if(sjsz[sjwz[i]]===0){
					return;
				}
				i=sjsz[sjwz[i]];
				if(jcjmlxdq===sjmz[i]){
					jcjgzj(jmwz,"3相同功能的积木");
					jcjgzj(i,":和这个相同");
					return;
				}else{
					if(!includes(jcjm0101,sjmz[i])){
						return;
					}
				}
			}
		}
	}
}
//效果范围
function jcjm02(jmwz,srks,srjs){
	if(jcjmlxdq==="looks_seteffectto"){
		i=sjsz[srks+1];
		if(i<0&&i>=-1000000){
			i=Number(sjwb[-i-1]);
			m=sjsz[srks+2];
			if(m==="COLOR"){
				if(i<0||i>=200){
					jcjgzj(jmwz,"1效果颜色值超出范围(0到200)");
				}
			}
			if(m==="FISHEYE"){
				if(i<0){
					jcjgzj(jmwz,"1效果鱼眼值超出范围(不能小于0)");
				}
			}
			if(m==="WHIRL"){
				if(false){
					jcjgzj(jmwz,"1效果漩涡值超出范围()");
				}
			}
			if(m==="PIXELATE"){
				if(i<0){
					jcjgzj(jmwz,"1效果像素化值超出范围(不能小于0");
				}
			}
			if(m==="MOSAIC"){
				if(i<0&&i%10!==0){
					jcjgzj(jmwz,"1效果马赛克值不在范围(10的倍数)");
				}
			}
			if(m==="BRIGHTNESS"){
				if(Math.abs(i)>100){
					jcjgzj(jmwz,"1效果亮度值超出范围(-100到100)");
				}
				if(Math.abs(i)<1){
					jcjgzj(jmwz,"3效果亮度值可能太小(-100到100)");
				}
			}
			if(m==="GHOST"){
				if(i<0||i>100){
					jcjgzj(jmwz,"1效果虚像值超出范围(0到100)");
				}else{
					if(i<1){
						jcjgzj(jmwz,"3效果虚像值可能太小(0到100)");
					}
				}
			}
		}
		return;
	}
	if(jcjmlxdq==="sound_seteffectto"){
		i=sjsz[srks+1];
		if(i<0&&i>=-1000000){
			i=Number(sjwb[-i-1]);
			m=sjsz[srks+2];
			if(m==="PITCH"){
				if(Math.abs(i)>1000){
					jcjgzj(jmwz,"1效果音调值超出范围(-1000到1000)");
				}
				if(Math.abs(i)<8){
					jcjgzj(jmwz,"1效果音调值可能太小(100为八度)");
				}
			}
			if(m==="PAN"){
				if(Math.abs(i)>100){
					jcjgzj(jmwz,"1效果左右平衡值超出范围(-100到100)");
				}
				if(Math.abs(i)<5){
					jcjgzj(jmwz,"1效果左右平衡值可能太小(-100到100)");
				}
			}
		}
		return;
	}
}
//循环 如果 克隆 停止
function jcjm03(jmwz,srks,srjs){
	if(jcjmlxdq==="control_forever"){
		jcjm03xh(sjsz[srks+1]);
	}
	if(jcjmlxdq==="control_repeat"
	|| jcjmlxdq==="control_repeat_until"
	|| jcjmlxdq==="control_while"
	|| jcjmlxdq==="control_for_each"){
		jcjm03xh(sjsz[srks+2]);
	}
	if(jcjmlxdq==="control_repeat"
	|| jcjmlxdq==="control_for_each"){
		i=sjsz[srks+1];
		if(i<0&&i>=-1000000){
			m=Number(sjwb[-i-1]);
			if(m<=0||m%1!==0){
				jcjgzj(jmwz,"0重复执行次数不是正整数");
			}
			if(m>100000000){
				jcjgzj(jmwz,"3重复执行次数太多");
			}
		}
		return;
	}
	if(jcjmlxdq==="control_wait"){
		i=sjsz[srks+1];
		if(i<0&&i>=-1000000){
			m=Number(sjwb[-i-1]);
			if(m<0){
				jcjgzj(jmwz,"0等待负数秒");
			}
			if(m>300){
				jcjgzj(jmwz,"3等待时间太久(超过5分钟)");
			}
		}
		return;
	}
	if(jcjmlxdq==="control_if"){
		i=sjsz[srks];
		if(i>0&&i<=1000000){
			m=sjmz[i];
			if(m==="control_if"
			|| m==="control_if_else"){
				jcjmblgb(sjsz[srks+1],sjsz[srks+2],i);
				if(jg!==0){
					jcjmblgb(sjsz[sjwz[i]+1],sjsz[srks+2],i);
					if(jg!==0){
						i=sjsz[srks+2];
						while(sjsz[sjwz[i]]!==0){
							i=sjsz[sjwz[i]];
						}
						j=1;
						if(sjmz[i]==="control_stop"){
							i=sjsz[sjwz[i]+1];
							if(sjwb[-i-1]==="this script"){
								j=0;
							}else{
								if(sjwb[-i-1]==="all"){
									j=0;
								}
							}
						}
						if(j===1){
							jcjgzj(jg,"3如果积木内的积木可能会干扰下一个如果积木的条件");
							jcjgzj(jmwz,":这个如果积木");
							jcjgzj(sjsz[srks],":下一个如果积木");
						}
					}
				}
			}
		}
		return;
	}
	if(jcjmlxdq==="control_while"
	|| jcjmlxdq==="control_repeat_until"){
		jcjmblgb(sjsz[srks+1],sjsz[srks+2],i);
		if(jg===0){
			jcjmwtbl(sjsz[srks+1],i);
			if(jg===0){
				jcjgzj(jmwz,"3循环条件没在循环体中改变");
			}else{
				jcjgzjyb(jmwz,"3循环条件没在循环体中改变");
			}
		}else{
			if(jcjmlxdq==="control_while"){
				jcjmblfx(sjsz[srks+1],sjsz[srks+2],1,i);
			}else{
				jcjmblfx(sjsz[srks+1],sjsz[srks+2],-1,i);
			}
		}
		return;
	}
	if(jcjmlxdq==="control_create_clone_of"){
		i=sjsz[srks+1];
		if(sjmz[i]==="control_create_clone_of_menu"){
			i=sjsz[sjwz[i]+1];
			if(sjwb[-i-1]==="_myself_"){
				i=sjmz[jcjmktdq];
				if(contains(i,"_when")
				&& i!=="event_whenflagclicked"
				|| i==="control_start_as_clone"){
					i=0;
					jg=0;
					//print("kelong",jcjmlb);
					while(i<jcjmlb.length&&jg===0){
						if(sjmz[jcjmlb[i]]==="control_if"
						|| sjmz[jcjmlb[i]]==="control_if_else"){
							jcjmjsbl(jcjmlb[i],i);
						}
						i+=2;
					}
					if(jg===0){
						jcjgzj(jmwz,"3克隆操作没有局部变量控制");
					}
				}
			}
		}
		return;
	}
	if(jcjmlxdq==="control_delete_this_clone"){
		i=0;
		jg=0;
		while(i<jcjmlb.length&&jg===0){
			if(sjsz[sjwz[jcjmlb[i]]]!==0){
				jg=jcjmlb[i];
			}
			i+=2;
		}
		if(jg!==0){
			jcjgzj(jmwz,"3删除克隆体积木后仍有可被运行的积木");
			jcjgzj(sjsz[sjwz[jg]],":在这里");
			jcjgzj(jg,":因为有这个积木");
		}
	}
	if(jcjmlxdq==="control_stop"){
		i=sjsz[srks+1];
		if(sjwb[-i-1]==="this script"){
			if(jcdywzdq!==-1){
				jcjgzj(jmwz,"4在自定义积木中停止这个脚本只会跳出自定义积木");
				jcjgzj(jcjmktdq,":在这里");
			}
		}
		if(sjwb[-i-1]==="this script"
		|| sjwb[-i-1]==="all"){
			i=jcjmlb.length-2;
			if(jcjmlb.length<2
			|| sjmz[jcjmlb[i]]!=="control_if"
			&& sjmz[jcjmlb[i]]!=="control_if_else"){
				jcjgzj(jmwz,"2停止积木应该被放在如果/那么积木的后面");
				if(jcjmlb.length>=2){
					jcjgzj(jcjmlb[i],":但是它在这个积木的末尾");
				}else{
					jcjgzj(jcjmktdq,":但是它在这个积木的末尾");
				}
			}
		}
	}
}
//检查循环体
function jcjm03xh(jmwz){
	if(jmwz>0&&jmwz<=1000000){
		if(sjsz[sjwz[jmwz]+1]===0){
			if(sjmz[jmwz]==="sound_play"){
				jcjgzj(jmwz,"1应使用'播放声音并等待'");
			}
		}
		if(jcjmyb===0){
			jg=0;
			i=0;
			while(i<jcjm0302.length&&jg===0){
				jcjmssjm(jmwz,jcjm0302[i],false,i);
				i++;
			}
			while(i<jcjm0004.length&&jg===0){
				jcjmssjm(jmwz,jcjm0004[i],false,i);
				i++;
			}
			if(jg===0){
				jcjgzjyb(jmwz,"3建议使用'运行时不刷新屏幕'");
			}
		}
	}
}
//侦测 计算 变量 画笔
function jcjm04(jmwz,srks,srjs){
	if(jcjmlxdq==="sensing_dayssince2000"){
		jcjgzj(jmwz,"4注意时区差异");
		return;
	}
	if(jcjmlxdq==="sensing_current"){
		if(sjwb[-sjsz[srks+1]-1]==="DAYOFWEEK"){
			jcjgzj(jmwz,"4注意星期差异");
		}
		return;
	}
	if(jcjmlxdq==="sensing_of_object_menu"){
		if(sjwb[-sjsz[srks+1]-1]==="_stage_"){
			jcjgzj(jmwz,"2无意义的积木(可以用更简单的积木替换");
		}
		return;
	}
	clwbqm2("operator_",jcjmlxdq);
	if(clwbwz===-1){
		if(jcjmlxdq==="operator_not"){
			i=0;
			while(i<jcjmlb.length){
				if(sjmz[jcjmlb[i]]==="operator_not"){
					jcjgzj(jcjmlb[i],"3不成立里包含不成立");
					jcjgzj(jmwz,":包含的不成立");
				}
				i+=2;
			}
		}
		jg=0;
		i=srks+1;
		while(i<srjs){
			if(sjsz[i]>0||sjsz[i]<-1000000){
				jg=1;
			}
			if(jcjmlxdq!=="operator_equals"){
				jcjmsrsz(jmwz,sjsz[i],"","2空白的操作数");
			}
			if(jcjmlxdq==="operator_add"){
				jcjmsrsz(jmwz,sjsz[i],"0","3加零");
			}
			if(jcjmlxdq==="operator_subtract"&&i-srks===2){
				jcjmsrsz(jmwz,sjsz[i],"0","3减零");
			}
			if(jcjmlxdq==="operator_multiply"){
				jcjmsrsz(jmwz,sjsz[i],"0","2乘零");
				jcjmsrsz(jmwz,sjsz[i],"1","3乘一");
			}
			if(jcjmlxdq==="operator_divide"
			|| jcjmlxdq==="operator_mod"){
				if(i-srks===2){
					jcjmsrsz(jmwz,sjsz[i],"0","2被零除");
					jcjmsrsz(jmwz,sjsz[i],"1","3除一");
				}else{
					jcjmsrsz(jmwz,sjsz[i],"0","3除零");
				}
			}
			if(jcjmlxdq==="operator_letter_of"&&i-srks===2){
				j=sjsz[i];
				if(j<0&&j>=-1000000){
					m=Number(sjwb[-j-1]);
					if(m<=0||m%1!==0){
						jcjgzj(jmwz,"0字符编号不大于0");
					}
				}
			}
			if(jcjmlxdq==="operator_equals"){
				j=sjsz[i];
				if(j<0&&j>=-1000000){
					m=sjwb[-j-1];
					if(!isNaN(m)&&m!==""&&Number(m)%1!==0){
						jcjgzj(jmwz,"2用等于号比较小数");
					}
					jcwbdx(m);
					if(clwbwz===-1){
						jcjgzj(jmwz,"4比较不区分大小写");
					}
				}
			}
			i++;
		}
		if(jg===0){
			if(jcjmlxdq!=="operator_random"
			&& jcjmlxdq!=="operator_mathop"){
				jcjgzj(jmwz,"2无意义的积木");
			}
		}
		return;
	}
	if(jcjmlxdq==="data_insertatlist"
	|| jcjmlxdq==="data_replaceitemoflist"
	|| jcjmlxdq==="data_deleteoflist"
	|| jcjmlxdq==="data_itemoflist"){
		m=sjsz[srks+1];
		if(m<0&&m>=-1000000){
			m=sjwb[-m-1];
			if(!isNaN(m)&&m!==""&&(Number(m)<=0||Number(m)%1!==0)){
				jcjgzj(jmwz,"0项目编号不大于0");
			}
		}
	}
	if(jcjmlxdq==="pen_setPenColorParamTo"){
		m=Number(sjsz[srks+1]);
		if(m<0&&m>=-1000000){
			m=Number(sjwb[-m-1]);
			if(m<0||m>100){
				jcjgzj(jmwz,"2画笔参数应在0到100之间");
			}
		}
	}
}
/*}}}*/
// 检查工具
/*{{{*/
//检查积木1是否有变量在积木2中被改变
function jcjmblgb(jm1,jm2,ii){
	//print("jcjmblgb")
	jg=0;
	if(jm1>0&&jm1<=1000000){
		i=indexof(jcjm0101,"#"+sjmz[jm1]);
		if(i!==-1){
			i++;
			while(jcjm0101[i][0]!=="#"&&jg===0){
				jcjmssjm(jm2,"#"+jcjm0101[i],false,i);
				i++;
			}
		}
		i=sjwz[jm1]+1;
		while(i<sjwz[jm1+1]&&jg===0){
			m=sjsz[i];
			if(m>1000000&&m<=2000000){
				j=m+1000000;
			}else{
				if(m<-1000000&&m>=-2000000){
					j=m-1000000;
				}else{
					if(Math.abs(m)>1000000&&Math.abs(m)<=2000000){
						j=m;
					}else{
						j=0;
					}
				}
			}
			if(j===0){
				jcjmblgb(m,jm2,i);
			}else{
				jcjmssjm(jm2,j,false,i);
			}
			i++;
		}
	}
	i=ii;
}
//检查积木是否改变指定变量/是否有指定积木,hlhm忽略后面拼接的积木
function jcjmssjm(jmwz,wz,hlhm,ii){
	i=0;
	jcjm03dy=[];
	while(i<jcdywz.length){
		jcjm03dy.push(0);
		i++;
	}
	i=ii;
	jcjmssj1(jmwz,wz,hlhm,i);
}
function jcjmssj1(jmwz,wz,hlhm,ii){
	//print("jcjmssj1")
	jg=0;
	if(jmwz>0&&jmwz<=1000000){
		if("#"+sjmz[jmwz]===wz){
			jg=jmwz;
		}else{
			i=sjwz[jmwz];
			if(hlhm){
				i++;
			}
			while(i<sjwz[jmwz+1]&&jg===0){
				m=sjsz[i];
				if(m===wz){
					if(includes(jcjm0314,sjmz[jmwz])){
						jg=jmwz;
					}
				}else{
					jcjmssj1(m,wz,false,i);
				}
				i++;
			}
		}
	}else{
		if(jmwz>3000000){
			m=jmwz-3000001;
			if(jcjm03dy[m]===0){
				jcjm03dy[m]=1;
				if(jcdywz[m]!==0){
					m=Math.abs(jcdywz[m]);
					jcjmssj1(sjsz[sjwz[m]],wz,false,i);
				}
			}
		}
	}
	i=ii;
}
//检查积木1的变量在积木2中改变方向不正确
function jcjmblfx(jm1,jm2,fx,ii){
	jcjm03wz=[];
	jcjm03wz.push(jm1);
	//print("jcjmblfx",jm1)
	if(jm1>0&&jm1<=1000000){
		i=indexof(jcjm0101,"#"+sjmz[jm1]);
		if(i!==-1){
			//print("jcjmblfx",jcjm0101.slice(i+1,4))
			jcjmssfx(jm2,"#"+jcjm0101[i+1],fx,i);
			jcjmssfx(jm2,"#"+jcjm0101[i+2],0,i);
			jcjmssfx(jm2,"#"+jcjm0101[i+3],0,i);
			jcjmssfx(jm2,"#"+jcjm0101[i+4],-fx,i);
		}
		i=sjwz[jm1]+1;
		while(i<sjwz[jm1+1]){
			j=sjsz[i];
			if(j>1000000&&j<=2000000){
				j=j+1000000;
			}else{
				if(j<-1000000&&j>=-2000000){
					j=j-1000000;
				}else{
					j=0;
				}
			}
			m=fx;
			if(sjmz[jm1]==="operator_gt"&&i===sjwz[jm1]+2){
				m=-m;
			}
			if(sjmz[jm1]==="operator_lt"&&i===sjwz[jm1]+1){
				m=-m;
			}
			if(sjmz[jm1]==="operator_not"){
				m=-m;
			}
			if(sjmz[jm1]==="operator_equals"){
				m=2;
			}
			if(j===0){
				jcjmblfx(sjsz[i],jm2,m,i);
			}else{
				//print("jcjmblfx",j,m)
				jcjmssfx(jm2,j,m,i);
			}
			i++;
		}
	}
	i=ii;
}
//检查指定积木反方向改变变量
function jcjmssfx(jmwz,wz,fx,ii){
	//print("jcjmssfx",jm1)
	i=0;
	jcjm03dy=[];
	while(i<jcdywz.length){
		jcjm03dy.push(0);
		i++;
	}
	i=ii;
	jcjmssf1(jmwz,wz,fx,i);
}
function jcjmssf1(jmwz,wz,fx,ii){
	//print("jcjmssf1",jmwz,wz,fx)
	if(wz==="#"){
		return;
	}
	jg=0;
	if(jmwz>0&&jmwz<=1000000){
		//print("jcjmssfx",jmwz,"#"+sjmz[jmwz])
		if("#"+sjmz[jmwz]===wz){
			m=sjsz[sjwz[jmwz]+1];
			if(m<0&&m>=-1000000){
				if(fx===0){
					jg="3循环变量在循环内被初始化";
				}else{
					if(Math.abs(fx)===1){
						m=Number(sjwb[-m-1]);
						if(m*fx>0){
							jg="3循环变量改变方向不正确";
						}
					}
				}
			}
		}else{
			i=sjwz[jmwz];
			while(i<sjwz[jmwz+1]&&jg===0){
				m=sjsz[i];
				//print("jcjmssfx",sjwz[jmwz],i,m)
				if(m===wz){
					jg=jmwz;
				}else{
					jcjmssf1(m,wz,fx,i);
				}
				i++;
			}
			if(jg!==0){
				jg=0;
				if(sjmz[jmwz]==="data_setvariableto"){
					m=sjsz[sjwz[jmwz]+1];
					if(m<0&&m>=-1000000){
						jg="3循环变量在循环内被初始化";
					}
				}else{
					if(sjmz[jmwz]==="data_changevariableby"){
						m=sjsz[sjwz[jmwz]+1];
						if(m<0&&m>=-1000000&&Math.abs(fx)===1){
							m=Number(sjwb[-m-1]);
							//print("jcjm0322change",m)
							if(m*fx>0){
								jg="3循环变量改变方向不正确";
							}
						}
					}
				}
			}
		}
		if(jg!==0){
			i=jcjm03wz.length-1;
			if(i>0){
				jcjgzj1(jmwz,jcjm03wz[i],jg);
			}else{
				jcjgzj(jmwz,jg);
			}
			while(i>0){
				jcjgzj1(jcjm03wz[i],jcjm03wz[i],":来自定义");
				i--;
			}
			jcjgzj1(jcjm03wz[0],jcjmktdq,":循环条件");
		}
	}else{
		if(jmwz>3000000){
			m=jmwz-3000001;
			if(jcjm03dy[m]===0){
				jcjm03dy[m]=1;
				if(jcdywz[m]!==0){
					m=Math.abs(jcdywz[m]);
					jcjm03wz.push(jmwz);
					jcjmssf1(sjsz[sjwz[m]],wz,i);
					jcjm03wz.pop();
				}
			}
		}
	}
	i=ii;
}
//检查积木的数值是否为wz的数值，如果是则提示文本
function jcjmsrsz(jmwz,wz,sz,wb){
	if(wz<0&&wz>=-1000000){
		m=sjwb[-wz-1];
		if(m===sz
		|| !isNaN(m)
		&& !isNaN(sz)
		&& m!==""
		&& sz!==""
		&& Number(m)===Number(sz)
		){
			jcjgzj(jmwz,wb);
		}
	}
}
//检查积木(是否有)角色变量
function jcjmjsbl(jmwz,ii){
	jg=0;
	if(jmwz>0&&jmwz<=1000000){
		i=sjwz[jmwz];
		while(i<sjwz[jmwz+1]&&jg===0){
			m=sjsz[i];
			if(m>1000000&&m<=3000000){
				jg=jmwz;
			}else{
				jcjmjsbl(m,i);
			}
			i++;
		}
	}
	i=ii;
}
//检查积木(是否有)舞台变量(包括类似 x坐标)
function jcjmwtbl(jmwz,ii){
	jg=0;
	if(jmwz>0&&jmwz<=1000000){
		i=sjmz[jmwz];
		clwbqm2("operator_",i);
		if(clwbwz!==-1){
			clwbqm2("data_",i);
			if(clwbwz!==-1){
				clwbqm2("argument_",i);
				if(clwbwz!==-1){
					if(i!=="sensing_distanceto"
					&& i!=="sensing_touchingobject"
					&& i!=="sensing_touchingcolor"
					&& i!=="sensing_coloristouchingcolor"){
						jg=-1;
					}
				}
			}
		}
		i=sjwz[jmwz];
		while(i<sjwz[jmwz+1]&&jg===0){
			m=sjsz[i];
			if(m<-1000000&&m>=-3000000){
				jg=jmwz;
			}else{
				jcjmwtbl(m,i);
			}
			i++;
		}
	}
	i=ii;
}
/*}}}*/
function jcwbdx(st){
	//$c=x;
	clwbwz=0;
	while(clwbwz<st.length){
		if(contains("ABCDEFGHIJKLMNOPQRSTUVWXYZ",st[clwbwz])){
			clwbwz=-1;
			return;
		}
		clwbwz++;
	}
}
/*}}}*/
// 数据
/*{{{*/
function wjks(){
	var cltswtjmlx=[
		"motion_goto_menu",
		"motion_glideto_menu",
		"motion_pointtowards_menu",
		"control_create_clone_of_menu",
		"sensing_touchingobjectmenu",
		"sensing_distancetomenu",
		"sensing_of_object_menu"
	];
}
function jcks(){
	//使用变量的积木
	jcjm0001=[
		"data_listcontainsitem",
		"data_itemnumoflist",
		"data_itemoflist",
		"data_showlist",
		"data_showvariable",
		"data_savelist",
		"data_savevariable"
	];
	//判断积木
	jcjm0002=[
		"sensing_touchingobject",
		"sensing_coloristouchingcolor",
		"sensing_touchingcolor",
		"sensing_keypressed",
		"sensing_mousedown",
		"operator_contains",
		"operator_and",
		"operator_or",
		"operator_not",
		"data_listcontainsitem",
		"sensing_loud",
		"community_isMyFans",
		"community_isLiked",
		"faceSensing_faceIsDetected",
		"community_isFollower",
		"community_isProjectLover",
		"puzzle_isPaintSameAsWatermark"
	];
	//带有判断条件的积木
	jcjm0003=[
		"operator_and",
		"operator_or",
		"operator_not",
		"control_if",
		"control_if_else",
		"control_repeat_until",
		"control_while",
		"control_wait_until"
	];
	//导致等待的积木
	jcjm0004=[
		"music_playDrumForBeats",
		"music_restForBeats",
		"music_playNoteForBeats",
		"looks_sayforsecs",
		"looks_thinkforsecs",
		"data_savevariable",
		"data_savelist",
		"data_loadvariable",
		"data_loadlist",
		"text_animateText"
	];
	//变量与会影响他们的积木(1.增加 2.设定 3.影响 4.减少)
	jcjm0101=[
		"#position",//0
		"",
		"motion_gotoxy",
		"motion_goto",
		"",
		"#motion_xposition",
		"motion_changexby",
		"motion_setx",
		"",
		"",
		"#motion_yposition",
		"motion_changeyby",
		"motion_sety",
		"",
		"",
		"#motion_direction",
		"motion_turnright",
		"motion_pointindirection",
		"motion_pointtowards",
		"motion_turnleft",
		"#looks_costumenumbername",
		"looks_nextcostume",
		"looks_switchcostumeto",
		"",
		"",
		"#looks_backdropnumbername",
		"looks_nextbackdrop",
		"looks_switchbackdropto",
		"",
		"",
		"#looks_size",
		"looks_changesizeby",
		"looks_setsizeto",
		"",
		"",
		"#",
		"",
		"looks_show",
		"looks_hide",
		"",
		"#",
		"looks_gotofrontback",
		"looks_goforwardbackwardlayers",
		"",
		"",
		"#!",
		"looks_changeeffectby",
		"looks_seteffectto",
		"looks_cleargraphiceffects",
		"",
		"#sound_volume",
		"sound_changevolumeby",
		"sound_setvolumeto",
		"",
		"",
		"#!",
		"sound_changeeffectby",
		"sound_seteffectto",
		"sound_cleareffects",
		"",
		"#v",
		"data_changevariableby",
		"data_setvariableto",
		"",
		"",
		"#!",
		"pen_changePenColorParamBy",
		"pen_setPenColorParamTo",
		"pen_setPenColorToColor",
		"",
		"#",
		"pen_changePenSizeBy",
		"pen_setPenSizeTo",
		"",
		"",
		"#music_getTempo",
		"music_changeTempo",
		"music_setTempo",
		"",
		""
	];
	//不能重复使用的积木
	jcjm0102=[
		"motion_setrotationstyle",
		"motion_ifonedgebounce",
		"motion_movesteps",
		"sensing_setdragmode",
		"sensing_resettimer",
		"music_setInstrument",//5
		"videoSensing_videoToggle",
		"text2speech_setVoice",
		"text2speech_setLanguage",
		"control_clear_counter",
		"text_setText",//10
		"text_setFont",
		"text_setColor",
		"text_setWidth",
		"",
	];
	//导致画面变化的积木
	jcjm0302=[
		"looks_say",
		"looks_switchcostumeto",
		"looks_nextcostume",
		"looks_switchbackdropto",
		"looks_nextbackdrop",
		"looks_changesizeby",
		"looks_setsizeto",
		"looks_changeeffectby",
		"looks_seteffectto",
		"looks_cleargraphiceffects",
		"looks_show",
		"looks_hide",
		"looks_gotofrontback",
		"looks_goforwardbackwardlayers",
		"motion_movesteps",
		"motion_turnright",
		"motion_turnleft",
		"motion_goto",
		"motion_gotoxy",
		"motion_pointindirection",
		"motion_pointtowards",
		"motion_changexby",
		"motion_setx",
		"motion_changeyby",
		"motion_sety",
		"motion_ifonedgebounce",
		"box2d_doTick",
		"text_clearText",
		"text_setFont",
		"text_setColor",
		"text_setWidth",
		"motion_movegrids",
		"pen_stamp",
		"pen_penDown",
	];
	//导致变量改变的积木
	jcjm0314=[
		"data_loadvariable",
		"data_loadlist",
		"data_setvariableto",
		"data_changevariableby",
		"data_addtolist",
		"data_deleteoflist",
		"data_deletealloflist",
		"data_insertatlist",
		"data_replaceitemoflist"
	];
}
/*}}}*/
})();
