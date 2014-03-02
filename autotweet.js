var twitter=require('twitter');
var fs=require('fs');

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function MarkovChainGenerator(corpus){
	this.transitionMatrix={};
	numbers={};
	collection={}
	for(var x=0;x<corpus.length;x++){
		var sentenceTokens=corpus[x].split(" ");
		for(var y=0;y<sentenceTokens.length;y++){
			if(y!==sentenceTokens.length-1){
				var token=sentenceTokens[y];
				if(collection[token]===undefined){
					collection[token]=[];
				}
				collection[token].push(sentenceTokens[y+1]);
			}
		}
	}
	for(var token in collection){
		var occurences=collection[token];
		numbers[token]={};
		for(var i=0;i<occurences.length;i++){
			occurence=occurences[i];
			if(numbers[token][occurence]===undefined){
				numbers[token][occurence]=1;
			}else{
				numbers[token][occurence]++;
			}
		}
	}
	for(var token in numbers){
		this.transitionMatrix[token]={}
		total=Object.keys(numbers[token]).length;
		for(var state in numbers[token]){
			this.transitionMatrix[token][state]=numbers[token][state]/total;
		}
	}
}
MarkovChainGenerator.prototype={
	generateWord:function(token){
		var possibilities={};
		for(var possibility in this.transitionMatrix[token]){
			possibilities[possibility]={"probability":0,"complete":false};
			possibilities[possibility]["probability"]=Math.round(this.transitionMatrix[token][possibility]*100);
		}
		var array=[];
		currentToken=0;
		for(var i=0;i<100;i++){
			var token=(Object.keys(possibilities)[currentToken]);
			if(i>possibilities[token]["probability"]){
				currentToken++;
				token=(Object.keys(possibilities)[currentToken]);
				array.push(token);
			}else{
				array.push(token);
			}
		}
		return array[getRandomInt(0,array.length)];
	},
	generateSentence:function(length){
		sentence=[Object.keys(this.transitionMatrix)[getRandomInt(0,Object.keys(this.transitionMatrix).length)]];
		for(var i=1;i<length-1;i++){
			console.log(sentence[i-1],i);
			sentence.push(this.generateWord(sentence[i-1]));
		}
		return sentence;
	}
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
		console.log(generator.generateSentence(5),"generated word");
	};
}
fs.readFile("./settings.json",'utf8',readSettings);