'use strict'

const gcloud = require('gcloud');
const fs = require('fs');

module.exports = class StorageWriter{
	init(fileName){
		let gcs = gcloud.storage({
			projectId: 'serp-main',
			keyFilename: 'keyfile.json'
		});

		let bucket = gcs.bucket('cognitive-data');
		let remoteFile = bucket.file(fileName);
		this.remoteWriteStream = remoteFile.createWriteStream();
	}

	write(data){
		this.remoteWriteStream.write(data);
		this.remoteWriteStream.end();
	}
}

