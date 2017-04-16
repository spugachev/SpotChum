'use strict'

const fs = require('fs');
const ig = require('instagram-node').instagram();
const uuid = require('node-uuid');
const StorageWriter = require('./storageWriter');
const Enqueue = require('./enqueue');

ig.use({ access_token: '47831649.1677ed0.a3ce7ba426a24d78b280a66b1ff63f92' });

module.exports = class LocationSearch{
	constructor(){
		this.index = 0;
	}

	search(lat, lng){
		ig.location_search({lat: lat, lng: lng }, 
			{distance: 5000}, (err, result) => {
			if(err) {
				console.error(err);
				return;
			}

			this.processLocations(result);
		});
	}

	processLocations(locs){
		let thisPtr = this;

		let prs = [];

		locs.forEach(loc => {
			let pr = new Promise((res,rej) => {
				let resStr = '';

				let processLoc = function(err, result, pagination){
					if(err) {
						console.dir(err);
						return;
					}
					
					result = result.filter(post => post.type === 'image');
					
					result.forEach(post => {
						resStr += JSON.stringify(post) + '\r\n';

						let imgs = post.images;
						let postLoc = post.location;
						let str = `${thisPtr.index},${loc.id},${post.id},${postLoc.latitude},${postLoc.longitude},${imgs.standard_resolution.url}`;

						console.log(str);

						thisPtr.index++;
					});

					if(pagination.next) {
		    			pagination.next(processLoc); 
		  			}else{
		  				res(resStr);
		  			}
				}

				ig.location_media_recent(loc.id, {}, processLoc);
			});

			prs.push(pr);
		});

		Promise.all(prs).then((val) => {
			let sw = new StorageWriter();

			let joinedStr = val.filter(str => str.length > 0).join('');
			let guid = uuid.v4();

			let fileName = guid + '.txt';
			sw.init(fileName);
			sw.write(joinedStr);

			console.log("Data was saved to the cloud!");

			let enq = new Enqueue();
			enq.enqueueProcessCrawlerData(fileName);
		});
	}
}