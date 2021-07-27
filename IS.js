function __is(x,b){
	var res=[];
	switch(x[0]){
		case '.':
			x=x.slice(1);
			this.eval(function(y){
				if(y.classList.contains(x) === b){
					res.push(y);
				}
			});
			break;
		default:
			x=x.toUpperCase();
			this.eval(function(y){
				if((y.nodeName === x) === b){
					res.push(y);
				}
			});
	}
	return new IS(res);
}
function __pn(x,y){
	var res=[];
	x.eval(function(z){
		var nx = z[y];
		if(nx !== null){
			res.push(nx);
		}
	});
	return new IS(res);
}
function __pa(x,y){
	var res=[];
	x.eval(function(z){
		var nx = z[y];
		while(nx !== null){
			if(!res.includes(nx)){
				res.push(nx);
				nx = nx[y];
			}
		}
	});
	return new IS(res);
}
function __child(x,b){
	var res=[];
	x.eval(function(y){___child(y,res,b);});
	return new IS(res);
}
function ___child(node,res,recu){
	var ch=node.children;
	for(var i=0;i<ch.length;i++){
		if(!res.includes(ch[i])){
			res.push(ch[i]);
			if(recu){
				___child(ch[i],res,true);
			}
		}
	}
}
IS.prototype.is = function _is(x){
	if(typeof x === "object"){
		if(x === null || x === undefined){
			return new IS();
		}else{
			return new IS([x]);
		}
	}else{
		return __is.call(this,x,true);
	}
};
IS.prototype.not = function _not(x){return __is.call(this,x,false);};
IS.prototype.and = function _and(x){
	var res=this.list;
	x.list.forEach(function(y){
		if(!res.includes(y)){
			res.push(y);
		}
	});
	return new IS(res);
};
IS.prototype.inner = function _inner(){return __child(this,true);};
IS.prototype.child = function _child(){return __child(this,false);};
IS.prototype.prev = function _prev(){return __pn(this,"previousElementSibling");};
IS.prototype.next = function _next(){return __pn(this,"nextElementSibling");};
IS.prototype.before = function _before(){return __pa(this,"previousElementSibling");};
IS.prototype.after = function _after(){return __pa(this,"nextElementSibling");};
IS.prototype.eval = function _eval(x){this.list.forEach(x);return this;};
IS.prototype.when = function _when(a,b){return this.eval(function(x){x.addEventListener(a,b);});};
IS.prototype.set = function _set(a,b){return this.eval(function(x){x[a]=b;});};
IS.prototype.attr = function _getattr(a,b){return this.eval(function(x){x.setAttribute(a,b);});};
IS.prototype.append = function _append(x){return this.eval(function(y){y.appendChild(x.cloneNode(true));});};
IS.prototype.remove = function _remove(){this.eval(function(x){x.parentElement.removeChild(x);});};
IS.prototype.style = function _style(a,b){return this.eval(function(x){x.style[a]=b;});};
IS.prototype.call = function _call(a,b){return this.eval(function(x){x[a].call(x,b);});};
function IS(res){
	if(this.constructor.name === "Window"){
		return new IS(res);
	}
	if(res === undefined){
		res = [];
		___child(document.getRootNode(),res,true);
	}
	this.list = res;
}
function is(x){return new IS().is(x);}
function not(x){return new IS().not(x);}
function when(a,b){window.addEventListener(a,b);}
function id(x){
	var res = document.getElementById(x);
	if(res === null){
		return new IS([]);
	}else{
		return is(document.getElementById(x));
	}
}
function create(x){return document.createElement(x);}

