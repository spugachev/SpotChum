'use strict'

const gcloud = require('gcloud');
const fs = require('fs');

let gcs = gcloud.storage({
	projectId: 'serp-main',
	keyFilename: 'keyfile.json'
});

let bucket = gcs.bucket('serp-main');
let remoteFile = bucket.file('results1.txt');
let remoteWriteStream = remoteFile.createWriteStream();

remoteWriteStream.write('12345');
remoteWriteStream.end();