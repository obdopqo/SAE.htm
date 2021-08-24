// stat统计
(function(){
"use strict";

var tnode,tdata;

var shadowblock=[
	"#motion_goto_menu",
	"#motion_glideto_menu",
	"#motion_pointtowards_menu",
	"#looks_costume",
	"#looks_backdrops",
	"#sound_sounds_menu",
	"#control_create_clone_of_menu",
	"#sensing_touchingobjectmenu",
	"#sensing_distancetomenu",
	"#sensing_of_object_menu",
	"#music_menu_DRUM",
	"#note",
	"#music_menu_INSTRUMENT",
	"#pen_menu_colorParam",
	"#videoSensing_menu_VIDEO_STATE",
	"#videoSensing_videoOn",
	"#videoSensing_menu_SUBJECT",
	"#videoSensing_menu_ATTRIBUTE",
	"#text2speech_menu_voices",
	"#text2speech_menu_languages",
	"#translate_menu_languages",
	"#makeymakey_menu_KEY",
	"#makeymakey_menu_SEQUENCE",
	"#tw_menu_mouseButton",
	"#stringExt_menu_urlNames",
	"#js_menu_urlNames",
	"#community_getUserInfo",
	"#kinect_menu_SENSOR",
	"#kinect_menu_PLAYER"
];

function statinit(){
	SAE.stat.typecount=[];
	SAE.stat.typename = ["motion","looks","sound","event","control","sensing","operator","data","procedures"];
	for(var i=0;i<SAE.stat.typename.length;i++){
		SAE.stat.typecount.push(0);
	}
}

SAE.stat.proj = function statproj(id){
	tnode=SAE.data.tnode;
	tdata=SAE.data.tdata;
	statinit();
	tnode.push(tdata.length);
	proj(id);
	tnode.pop();
}

function proj(id){
	for(var i=tnode[id];i<tnode[id+1];i++){
		spri(tdata[i]);
	}
}

function spri(id){
	blocklist(tdata[tnode[id]+6]);
}

function blocklist(id){
	for(var i=tnode[id];i<tnode[id+1];i++){
		block(tdata[i]);
	}
}

function block(id){
	if(id!==-1){
		// 积木类型
		var blocktype=tdata[tnode[id]];
		if(blocktype.slice(0,1)!=="["&&!shadowblock.includes(blocktype)){
			if(blocktype!=="procedures_definition"){
				//不是输入积木和定义积木
				var j=0,str="";
				while(j<blocktype.length&&blocktype[j]!=='_'){
					str+=blocktype[j];
					j++;
				}
				DEBUG("typename",str);
				var i=SAE.stat.typename.indexOf(str);
				if(i===-1){
					i=SAE.stat.typecount.length;
					SAE.stat.typename.push(str);
					SAE.stat.typecount.push(0);
				}
				SAE.stat.typecount[i]++;
				i=tnode[id]+1;
				j=tnode[id+1];
				if(blocktype==="procedures_call"){
					j--;
				}
				while(i<j){
					block(tdata[i]);
					i++;
				}
			}
		}
	}
}

SAE.stat.debug = function debug(){
	for(var i=0;i<SAE.stat.typename.length;i++){
		console.log(SAE.stat.typename[i],SAE.stat.typecount[i]);
	}
}

function DEBUG(...args){
	//console.log.apply(console,arguments);
}
})();
