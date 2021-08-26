(function(){

SAE.tools.removeext = function removeext(proj,ext){
	var targets=proj.targets;
	for(var i=0;i<targets.length;i++){
		var ib=targets[i].blocks;
		for(var j in ib){
			if(ib[j].opcode.slice(0,ext.length+1)===(ext+"_")){
				var repnext=ib[j].next;
				deleteblock(ib,j);
				for(var k in ib){
					replaceblock(ib,k,j,repnext);
				}
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
	if(proj.extensions.includes(ext)){
		proj.extensions.splice(proj.extensions.indexOf(ext),1);
	}
	return proj;
};

function replaceblock(blocks,id,old,New){
	if(blocks[id].parent===old){
		blocks[id].parent=New;
	}
	if(blocks[id].next===old){
		blocks[id].next=New;
	}
	var inputs=blocks[id].inputs;
	for(var i in inputs){
		switch(inputs[i][0]){
			case 3:
				if(inputs[i][2]===old){
					inputs[i][2]=New;
				}
				/* fall through */
			case 1:
			case 2:
				if(inputs[i][1]===old){
					inputs[i][1]=New;
				}
		}
	}
}

function deleteblock(blocks,id){
	var inputs=blocks[id].inputs;
	for(var i in inputs){
		switch(inputs[i][0]){
			case 3:
				if(typeof inputs[i][2]==="string"){
					deleteblock(blocks,inputs[i][2]);
				}
				/* fall through */
			case 1:
			case 2:
				if(typeof inputs[i][1]==="string"){
					deleteblock(blocks,inputs[i][1]);
				}
		}
	}
	delete blocks[id];
}

})();
