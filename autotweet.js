var twitter=require('twitter');
var fs=require('fs');

function Generator(corpus){
	this.transitionMatrix={}
	this.corpus=corpus;
}
Generator.prototype={

}
//tokenize a string by splitting it by the spaces
function tokenize(string){
	return string.split(" ");
}
//read the settings.json file
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
		var generator=new Generator(corpus);
		for(var x=0;x<corpus.length;x++){
			var sentenceTokens=tokenize(corpus[x]);
		}
	};
}
fs.readFile("./settings.json",'utf8',readSettings);