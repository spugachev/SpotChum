'use strict'

const gcloud = require('gcloud');
const fs = require('fs');
const readline = require('readline');

module.exports = class StorageReader{
	readLines(fileName, cb){
		let gcs = gcloud.storage({
			projectId: 'serp-main',
			keyFilename: 'keyfile.json'
		});

		let bucket = gcs.bucket('crawler-data');
		let remoteFile = bucket.file(fileName);
		var remoteReadStream = remoteFile.createReadStream();

		let arr = [];

		let lineReader = readline.createInterface({
		  input: remoteReadStream
		});

		lineReader.on('line', function (line) {
		  let post = JSON.parse(line);

		  arr.push(post);
		});

		lineReader.on('close', function() {
			cb(arr);
		});
	}
}

