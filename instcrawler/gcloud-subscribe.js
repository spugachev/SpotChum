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

topic.subscribe('new-subscription', {
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

  subscription.on('message', message => {
	 console.dir(message);
  });
});
