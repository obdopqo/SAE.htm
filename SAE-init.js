SAE = {
	init: {
		tnode:[],
		tdata:[],
	},
	data: {},
	json: {},
	disp: {},
	check: {},
	stat: {},
	graph: {},
	tools: {},
	options: {
		graph:{
			noBlockId: true
		},
		search:{
			testcount: 1000,
			count: 100
		},
		_OrigInputType: false
	}
};

SAE.init = function(){
	SAE.data.tnode=[];
	SAE.data.tdata=[];
}

