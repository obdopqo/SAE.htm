(function(){

SAE.tools.removeext = function removeext(proj,ext){
	var targets=proj.targets;
	for(var i=0;i<targets.length;i++){
		var ib=targets[i].blocks;
		for(var j in ib){
			if(ib[j].opcode.slice(0,ext.length+1)===(ext+"_")){
				var k=ib[j].parent;
				if(!replaceblock(ib,k,j,ib[j].next)){
					for(var k in ib){
						replaceblock(ib,k,j,ib[j].next);
					}
				}
				delete ib[j];
			}
		}
	}
	var monitors=proj.monitors;
	for(var i=0;i<monitors.length;i++){
		var im=monitors[i];
		if(im.opcode.slice(0,ext.length+1)===(ext+"_")){
			delete monitors[i];
		}
	}
	if(proj.extensions.include(ext)){
		proj.extensions.splice(proj.extensions.indexOf(ext),1);
	}
};

})();
