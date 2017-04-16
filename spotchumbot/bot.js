'use strict'

const gcloud = require('gcloud');

let TelegramBot = require('node-telegram-bot-api');

let options = {
  polling: true
};

let datastore = gcloud.datastore({
	projectId: 'serp-main',
	keyFilename: 'keyfile.json'
});

let token = process.env.TELEGRAM_BOT_TOKEN || '208170226:AAEwASH_RUZ6y0jsJk8u6ET_doc0QwhPVlE';
let bot = new TelegramBot(token, options);

bot.getMe().then(me => {
  console.log('Starting %s!', me.username);
});

bot.onText(/\/start/, msg => {
  let chatId = msg.chat.id;
  bot.sendMessage(chatId, "I'm SpotChum Bot! Send me your location.");
  let smileGif = __dirname +'/smile.gif';
  bot.sendDocument(chatId, smileGif);
});

bot.on('location', msg => {
  	let chatId = msg.chat.id;
  	let loc = msg.location;
  	let lat = loc.latitude;
	let long = loc.longitude;
	let min = 0.00000001;

	console.log(`Lat: ${lat} Long: ${long}`);

	var query = datastore.createQuery('Coordinates')
			.filter('Lat', '>=', Math.floor(lat) + min)
			.filter('Lat', '<=', Math.ceil(lat) - min);

	datastore.runQuery(query, (err,res) => {
		if(err){
			console.dir(err);
			return;
		}


		res = res.sort((a,b) =>{
			let val1 =  (Math.abs(lat - a.data.Lat) + Math.abs(long - a.data.Long));
			let val2 =  (Math.abs(lat - b.data.Lat) + Math.abs(long - b.data.Long));
			return val1 - val2;
		});

		if(res.length <= 0){
			bot.sendMessage(chatId, `Sorry, we have no data :((`);
		}else{
			let hp = res[0].data.Happiness;
			hp = Math.round(hp * 10000) / 100;

			let emoji = '\u{1F60D}';

			if(hp > 90){
				emoji = '\u{1F60D}';
			}else if(hp > 70){
				emoji = '\u{1F603}';
			}else if(hp > 50){
				emoji = '\u{1F612}';
			}else if(hp > 20){
				emoji = '\u{1F622}';
			}else{
				emoji = '\u{1F637}';
			}

			bot.sendMessage(chatId, `Happiness level is ${hp}%! ${emoji}`);
		}
	});
}); 
