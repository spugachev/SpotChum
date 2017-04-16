'use strict'

const gcloud = require('gcloud');

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
  	fileName: '528ebb25-a1a8-4444-b831-8b2614baa200.txt'
  }
}, err => {
	if(err){
		console.error(err);
	}
});
