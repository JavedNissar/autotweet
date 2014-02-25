var twitter=require('twitter');
var fs=require('fs');

function tokenize(string){
	tokens=[];
	for(var i=0;i<string.length;i++){
		if(string[i]!==" "){
			var currentTokenIndex;
			if(tokens.length==0){
				currentTokenIndex=0;
			}else{
				currentTokenIndex=tokens.length-1;
			}
			tokens[currentTokenIndex]+=string[i];
		}
		else{
			tokens.push("");
		}
	}
	return tokens;
}
function readSettings(err,fd){
	if(err){
		return console.log(err);
	}else{
		var settings=JSON.parse(fd);
		var twit=new twitter({
			consumer_key:settings.consumer_key,
			consumer_secret:settings.consumer_secret,
			access_token_key:settings.access_token_key,
			access_token_secret:settings.access_token_secret
		});
		var corpus=settings.corpus;
		var probabilityMatrix={};
		for(var x=0,lenX=corpus.length;x<lenX;x++){
			console.log(tokenize(corpus[x]));
		}
	};
}
fs.readFile("./settings.json",'utf8',readSettings);