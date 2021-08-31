(function(){

SAE.tools.removeexts = function removeexts(proj,exts){
	var targets=proj.targets;
	for(var i=0;i<targets.length;i++){
		var ib=targets[i].blocks;
		for(var j in ib){
			if(exts.includes(ib[j].opcode.split("_")[0])){
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
		if(exts.includes(im.opcode.split("_")[0])){
			delete monitors[i];
		}
	}
	if(proj.extensions.includes(ext)){
		proj.extensions.splice(proj.extensions.indexOf(ext),1);
	}
	return proj;
};

SAE.tools.removedisplay = function removedisplay(proj){
	for(var i=0;i<monitors.length;i++){
		var im=monitors[i];
		if(!im.visible){
			delete monitors[i];
		}
	}
	return proj;
};

SAE.tools.removeinput = function removeinput(proj){
	for(var i=0;i<targets.length;i++){
		var ib=targets[i].blocks;
		for(var j in ib){
			var ji=ib[j].inputs;
			for(var k in ji){
				if(typeof ji[k]==="object" && ji[k][0]===3){
					ji[k][2]=[4,0];
				}
			}
		}
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
