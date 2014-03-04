var twitter=require('twitter');
var fs=require('fs');
var util=require('util');

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//MARKOV CHAIN CODE
//Define the init statement
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
//Define two functions required
MarkovChainGenerator.prototype={
	//generate words
	//token is a word in the transition matrix
	generateWord:function(token){
		if(token!==undefined){
			//init object containing all possibilities for this particular state
			var possibilities={};
			for(var possibility in this.transitionMatrix[token]){
				possibilities[possibility]={"probability":0,"complete":false};
				possibilities[possibility]["probability"]=Math.round(this.transitionMatrix[token][possibility]*100);
			}
			var array=[];
			currentToken=0;
			var keys=Object.keys(possibilities);
			for(var x=0;x<keys.length;x++){
				var key=keys[x];
				for(var y=0;y<possibilities[key]["probability"];y++){
					array.push(key);
				}
			}
			return array[getRandomInt(0,array.length)];
		}else{
			return undefined;
		}
	},
	//generate entire sentences
	generateSentence:function(length){
		sentence=[Object.keys(this.transitionMatrix)[getRandomInt(0,Object.keys(this.transitionMatrix).length)]];
		for(var i=1;i<length-1;i++){
			generatedWord=this.generateWord(sentence[i-1]);
			if(generatedWord===undefined){
				console.log("reached end of markov chain");
				return sentence.join(" ");
			}else{
				sentence.push(generatedWord);
			}
		}
		return sentence.join(" ");
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
		twit.verifyCredentials(function(data) {
        	console.log(util.inspect(data));
    	}).updateStatus(generator.generateSentence(5),
        	function(data) {
            	console.log(util.inspect(data));
        	}
    	);
	};
}
fs.readFile("./settings.json",'utf8',readSettings);