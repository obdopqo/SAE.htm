SAE = SAE || {};

SAE.disp = SAE.disp || {};

// disp显示
(function(){
"use strict";

var tnode,tdata,table,dispdata;
var dispid,dispfor;
/*{{{*/
function dispinit(){
	dispid=-1;
	SAE.disp.error = []; //初始化
	SAE.disp.data = [""];
	dispdata = SAE.disp.data;
	tnode=SAE.data.tnode;
	tdata=SAE.data.tdata;
	table=SAE.disp.table;
}

// 在控制台上直接显示准备好的内容
SAE.disp.disp = function dispdisp(){
	dispdata = SAE.disp.data;
	for(var i=0;i<dispdata.length;i++){
		console.log(dispdata[i]);
	}
};

// 在控制台上显示缺少的积木显示表关键字
SAE.disp.disperr = function disperr(){
	dispdata = SAE.disp.error;
	for(var i=0;i<dispdata.length;i++){
		if(i===dispdata.indexOf(dispdata[i])){
			console.log(dispdata[i]);
		}
	}
};

function displine(x){
	display(x);
	dispdata.push("");
}

function display(x){
	dispdata[dispdata.length-1]+=x;
}

// 显示作品
SAE.disp.proj = function projdisp(id){
	dispinit();
	tnode.push(tdata.length);
	proj(id,"");
	tnode.pop();
}

function proj(id,indent){
	displine(indent+"* 作品");
	for(var i=tnode[id];i<tnode[id+1];i++){
		spri(tdata[i],indent+"  ");
	}
}

// 显示角色
SAE.disp.spri = function spridisp(id){
	dispinit();
	tnode.push(tdata.length);
	spri(id,"");
	tnode.pop();
}

function spri(id,indent){
	var i=tnode[id];
	displine(indent+tdata[i]);
	//-6: 同时这里也要改
	list2(tdata[i+1],"造型",indent+"  ");
	list2(tdata[i+2],"声音",indent+"  ");
	list(tdata[i+3],"变量",indent+"  ");
	list(tdata[i+4],"列表",indent+"  ");
	defs(tdata[i+5],indent+"  ");
	blocklist(tdata[i+6],indent+"  ");
}

function list(id,title,indent){
	displine(indent+title+":");
	for(var i=tnode[id];i<tnode[id+1];i++){
		displine(indent+"  * "+tdata[i]);
	}
}

//list2，用于显示造型，声音列表中的名称和文件名
function list2(id,title,indent){
	displine(indent+title+":");
	for(var i=tnode[id];i<tnode[id+1];i+=2){
		displine(indent+"  * "+tdata[i]);
		displine(indent+"    文件名: "+tdata[i+1]);
	}
}

function defs(id,indent){
	displine(indent+"定义:");
	for(var i=tnode[id];i<tnode[id+1];i+=2){
		displine(indent+"  * "+tdata[i+1]+" => "+tdata[i+0]);
	}
}
/*}}}*/

// 显示积木
/*{{{*/
function blocklist(id,indent){
	displine(indent+"积木");
	for(var i=tnode[id];i<tnode[id+1];i++){
		displine(indent+"* 积木 ["+i+"]");
		display(indent+"  ");
		//console.log("list",i,tdata[i]);
		block(tdata[i],indent+"  ",0,"@");
		displine("");
	}
}

// 显示特定积木组(id为开头积木编号,spid为需要获取位置的积木编号,返回spid所表示积木所在的行数)
SAE.disp.block = function blockdisp(id,spid){
	dispinit();
	dispid=spid;
	dispfor=-1;
	tnode.push(tdata.length);
	block(id,"",0,"@");
	tnode.pop();
	return dispfor;
}

// id: 积木tnode位置
// level: 积木括号运算等级(参见 SAE-disp.md)
// type: 积木的引用类型
// % 正常引用 $ 角色引用 & 翻译引用 @ 块引用
function block(id,indent,level,type){
	if(id===-1){
		// 空白积木
		display(table[table.indexOf("#[空白]")+1]);
	}else{
		// 记录特定积木所在的行号
		if(id===dispid){
			dispfor=dispdata.length-1;
		}
		// 积木类型
		var blocktype=tdata[tnode[id]];
		// 处于显示表中的位置
		var tindex=table.indexOf('#'+blocktype);
		var pattern,levelcr;
		if(tindex!==-1){
			// 积木模式
			pattern=table[tindex+1];
			// 当前运算等级
			levelcr=table[tindex+2];
		}else{
			SAE.disp.error.push('#'+blocktype);
			// 使用默认模式
			pattern="("+blocktype;
			for(var i=1;i<tnode[id+1]-tnode[id]-1;i++){
				pattern+=" %"+i;
			}
			pattern+=")";
			//console.log("mode",id,blocktype);
			if(blocktype[0]==='['){
				levelcr=-99;
				pattern="("+blocktype+' "%0")';
			}else{
				levelcr=0;
			}
		}
		switch(blocktype){
			case "procedures_definition":
			case "procedures_call":
				// 自定义积木统一特别处理
				blockdefs(id,pattern,indent);
				break;
			default:
				var j=0;
				if(levelcr!==0 && levelcr!==99 && levelcr!==-99){
					// 判断是否去括号
					if(Math.abs(levelcr) > Math.abs(level)){
						j=1;
					}
					if(Math.abs(levelcr) === Math.abs(level) && level < 0){
						j=1;
					}
				}
				for(var i=j;i<pattern.length-j;i++){
					var c=pattern[i];
					switch(c){
						case '%':
						case '$':
						case '&':
							// % 正常引用 $ 角色引用 & 翻译引用
							i++;
							//console.log("ref",id,blocktype,c,pattern[i],type);
							var value=tdata[tnode[id]+1+Number(pattern[i])];
							// 文本的计算顺序设为-99.
							if(levelcr === -99){
								// % 正常引用 $ 角色引用 & 翻译引用
								switch(type[0]){
									case '%':
										if(pattern === "%0" && (value === "" || String(Number(value)) !== value)){
											display('"' + value + '"');
										}else{
											display(value);
										}
										break;
									case '$':
										var index=table.indexOf("$"+value);
										if(index!==-1){
											value=table[index+1];
										}else if(value[0] === '_'){
											SAE.disp.error.push('$'+value);
										}
										display(value);
										break;
									case '&':
										var index=table.indexOf(type+value);
										if(index!==-1){
											value=table[index+1];
										}else{
											SAE.disp.error.push(type+value);
										}
										display(value);
										break;
								}
							}else{
								//console.log("block2",value)
								if(pattern[i]==='1'){
									// 如果是第一个参数，因为计算顺序是从左到右，因此括号可以去掉。
									if(c==='&'){
										block(value,indent,-Math.abs(levelcr),"&"+blocktype+":");
									}else{
										block(value,indent,-Math.abs(levelcr),c);
									}
								}else{
									if(c==='&'){
										block(value,indent,levelcr,"&"+blocktype+":");
									}else{
										block(value,indent,levelcr,c);
									}
								}
							}
							break;
						case '@':
							// @ 块引用
							i++;
							var value=tdata[tnode[id]+1+Number(pattern[i])];
							displine("");
							display(indent+"| "); // ?C1
							//console.log("block3",pattern[i],value);
							block(value,indent+"| ",levelcr,'%');
							displine("");
							display(indent+"\\-------"); // ?C2
							break;
						case '^':
							//转义字符
							i++;
							//防止jslint警告，这里的确是要向下执行的（没有break会导致向下面的default子句进行）
							/* fall through */
						default:
							display(c);
							break;
					}
				}
				break;
		}
		i=tdata[tnode[id]+1];
		if(levelcr!==-99&&i!==-1){
			displine("");
			display(indent);
			//console.log("block5",i,id,tnode[id]);
			block(i,indent,level,type);
		}
	}
}

function blockdefs(id,title,indent){
	display(title);
	var pattern=tdata[tnode[id+1]-1];
	var j=tnode[id]+2;
	for(var i=0;i<pattern.length;i++){
		var c=pattern[i];
		if(c==='%'){
			if(i!==pattern.length-1){
				if(pattern[i+1]==="%"){
					display('%');
				}else{
					//console.log("block1",tdata[j],"j=",j);
					block(tdata[j],indent,0,c);
					i++;
					j++;
				}
			}
		}else{
			display(c);
		}
	}
}
/*}}}*/
})();
