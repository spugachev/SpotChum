'use strict'

const gcloud = require('gcloud');

module.exports = class Listener{
	listen(topicName, cb){
		let pubsub = gcloud.pubsub({
		  projectId: 'serp-main',
		  keyFilename: 'keyfile.json'
		});

		let topic = pubsub.topic(topicName, {
		    autoCreate: true
		  }, function (err, topic) {
		  if (err) {
		    console.error('cannot create topic', err);
		  }
		});

		topic.subscribe('new-subscription-' + topicName, {
		  autoAck: true,
		  reuseExisting: true
		}, (err, subscription) => {
		  if (err) {
		    console.error('cannot subscribe', err);
		    return;
		  }

		  subscription.on('error', err => {
		  	console.error(err);
		  });

		  subscription.on('message', msg => {
			 cb(msg);
		  });
		});
	}
}