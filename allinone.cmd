1>1/* :
@cscript //nologo //e:jscript "%~f0" "SAE.htm" "SAE.1.htm"&goto :eof
*/
var a=LoadUTF8(WSH.arguments(0));
var r1=/<script src="([^"]+)"><\/script>/g;
function f1(a,b){
	return "<script>\r\n"+LoadUTF8(b)+"\r\n</script>"
}
	
var r2=/<link rel="stylesheet" href="([^"]*)">/g;
function f2(a,b){
	return "<style>\r\n"+LoadUTF8(b)+"\r\n</style>"
}
SaveUTF8(
	WSH.arguments(1),
	a
	.replace(r1,f1)
	.replace(r2,f2)
);
function LoadUTF8(f){
	var sta = new ActiveXObject("Adodb.Stream");
	sta.type = 2;
	sta.mode = 3;
	sta.charset = "UTF-8";
	sta.open();
	sta.loadFromFile(f);
	var result = sta.readtext();
	sta.close();
	return result;
}

function SaveUTF8(f,str){
	var sta = new ActiveXObject("Adodb.Stream");
	sta.Type = 2;
	sta.mode = 3;
	sta.charset = "UTF-8";
	sta.open();
	sta.writetext(str);
	var stb = new ActiveXObject("Adodb.Stream");
	stb.Type = 1;
	stb.mode = 3;
	stb.open();
	sta.position = 3;
	sta.copyto(stb);
	stb.saveToFile(f,2);
	stb.close();
	sta.close();
}
