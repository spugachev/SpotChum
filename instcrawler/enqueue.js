'use strict'

const gcloud = require('gcloud');

module.exports = class Enqueue{
	enqueueProcessCrawlerData(fileName){
		let pubsub = gcloud.pubsub({
		  projectId: 'serp-main',
		  keyFilename: 'keyfile.json'
		});

		let topic = pubsub.topic('cognitive', {
		    autoCreate: true
		  }, function (err, topic) {
		  if (err) {
		    console.error('cannot create topic', err);
		  }
		});

		topic.publish({
		  data: {
		  	action: 'processCrawlerData',
		  	fileName: fileName
		  }
		}, err => {
			if(err){
				console.error(err);
			}
		});
	}
}