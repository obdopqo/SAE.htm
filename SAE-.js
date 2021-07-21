var fs=require("fs");

var SAE;
include("SAE-init.js");
include("SAE-json.js");
include("SAE-disp.js");
include("SAE-disp-table.js");
//include("SAE-check.js");
//include("SAE-check-table.js");

SAE.init();
//SAE.options._OrigInputType = true;
var x=SAE.json.load(fs.readFileSync(process.argv.length>2?process.argv[2]:"project.json").toString());
//SAE.json.debug(x,"");
SAE.disp.proj(x);
SAE.disp.disp();
//SAE.disp.disperr();
//SAE.check.proj(x);
//SAE.check.debug();
// console.log(require('util').inspect(Symbol,true,null,true));
function include(x){
	eval(fs.readFileSync(x).toString());
}
