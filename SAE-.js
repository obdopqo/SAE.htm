var fs=require("fs");

var SAE;

var FAST=true;

include("SAE-init.js");
if(FAST){
	include("SAE-json-fast.js");
}else{
	include("SAE-json.js");
}
include("SAE-disp.js");
include("SAE-disp-table.js");
include("SAE-check.js");
include("SAE-stat.js");
include("SAE-stat-table.js");
include("SAE-graph.js");
include("SAE-tools.js");

SAE.init();
var json=fs.readFileSync(process.argv.length>2?process.argv[2]:"project.json").toString();
var x=SAE.json.load(json);
//SAE.json.debug(x,"");
//SAE.disp.proj(x);
//SAE.disp.disp();
//SAE.disp.disperr();
//SAE.check.proj(x);
//SAE.check.debug();
//SAE.stat.proj(x);
//SAE.stat.debug();
//SAE.stat.graph(-200,-100,400,200,10);
//console.log(SAE.stat.graphdata);
//SAE.graph.proj(x);
//SAE.graph.debug();
//SAE.graph.debugnum();
//console.log("stat.complexity",SAE.stat.complexity);
//console.log("graph.complexity",SAE.graph.complexity);
//console.log("graph.complexity_1",SAE.graph.complexity_1);
//console.log("graph.complexity_2",SAE.graph.complexity_2);
//fs.writeFileSync("project.1.json",JSON.stringify(SAE.tools.removeext(JSON.parse(json),"translate")));

function include(x){
	eval(fs.readFileSync(x).toString());
}
