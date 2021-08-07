// SAE.htm WQL
(function(){
SAE.file={};

SAE.file.list = [];

SAE.file.add = function fadd(name,time,data){
	SAE.file.list.push({name:name,time:time,data:data});
};

SAE.file.del = function fdel(x){
	SAE.file.list.splice(x,1);
};

SAE.file.data = function data(x){
	return SAE.file.list[x].data;
};

}());
