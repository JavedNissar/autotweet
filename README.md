#autotweet.js
##What is it?
autotweet.js is a simple node.js script that randomly generates some text from a list of sentences (using a [Markov Chain](https://en.wikipedia.org/wiki/Markov_chain)) and
then posts it as a tweet on twitter.
##How Do I use it?
Before you try using autotweet.js, you'll need to have a [twitter](https://twitter.com) account and you'll need to have [node.js](http://nodejs.org) installed on your computer. After you have that done and over with, just clone autotweet.js from github.
```Batchfile
git clone https://github.com/WaldoHatesYou/autotweet.git
```
Then, go to the directory "autotweet" directory and write out a "settings.json" file. The "settings.json" file should contain the information that is required to post to your twitter account (api consumer key, api consumer secret, api access token key, and api access token secret) as well as a list of sentences that is to be included in the corpus field of the "settings.json" file. An example is shown below.
```Javascript
{
	"consumer_key":"Insert key here",
	"consumer_secret":"Insert consumer secret here",
	"access_token_key":"Insert access token key here",
	"access_token_secret":"Insert access token secret here",
	"corpus":[
		"Hi, I am a sentence in a corpus",
		"Is this sentence awesome or is this sentence really awesome?",
		"Strawberry fields forever"
	]
}
```
After you're done that, grab the node-twitter library using the following command.
```Batchfile
npm init
```
Once that finishes, just type in the following command to post an automatically generated tweet to twitter.
```Batchfile
node autotweet.js
```