async function main(){
	var input = await new Promise(function(resolve,reject){
		process.stdin.setEncoding('utf8');
		var res = "";
		process.stdin.on('data',function(data){
			res+=data;
		});
		process.stdin.on('end',function(){
			resolve(res);
		});
	});
	process.stdout.write(input.replace(/ \[\d+\]$/gm,"").replace(/ \(\d+\)$/gm,""));
}
main();
