var twitter=require('twitter');
var fs=require('fs');

function MarkovChainGenerator(corpus){
	this.transitionMatrix={};
	this.collection={}
	for(var x=0;x<corpus.length;x++){
		var sentenceTokens=tokenize(corpus[x]);
		for(var y=0;y<sentenceTokens.length;y++){
			if(y!=sentenceTokens.length-1){
				token=sentenceTokens[y];
				if(this.collection[token]===undefined){
					this.collection[token]=[];
				}
				this.collection[token].push(sentenceTokens[y+1]);
			}
		}
	}
	for(var token in this.collection){
		var occurences=this.collection[token];
		this.transitionMatrix[token]={};
		for(var i=0;i<occurences.length;i++){
			occurence=occurences[i];
			if(this.transitionMatrix[token][occurence]===undefined){
				this.transitionMatrix[token][occurence]=1;
			}else{
				this.transitionMatrix[token][occurence]++;
			}
		}
	}
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
		var generator=new MarkovChainGenerator(settings.corpus);
		console.log(generator.transitionMatrix);
	};
}
fs.readFile("./settings.json",'utf8',readSettings);