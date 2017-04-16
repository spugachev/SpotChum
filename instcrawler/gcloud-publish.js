'use strict'

const gcloud = require('gcloud');

let pubsub = gcloud.pubsub({
  projectId: 'serp-main',
  keyFilename: 'keyfile.json'
});

let topic = pubsub.topic('coordinates', {
    autoCreate: true
  }, function (err, topic) {
  if (err) {
    console.error('cannot create topic', err);
  }
});

topic.publish({
  data: {
  	action: 'locationSearch',
  	lat: 55.746639,
    lng: 37.626587
  }
}, err => {
	if(err){
		console.error(err);
	}
});
