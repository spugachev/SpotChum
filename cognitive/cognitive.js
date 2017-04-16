'use strict'

const http = require('https');
const fs  = require('fs');
const gcloud = require('gcloud');
const uuid = require('node-uuid');
const Listener = require('./listener');
const StorageReader = require('./storageReader');
const StorageWriter = require('./storageWriter');

let lst = new Listener();
lst.listen('cognitive', msg => {
	console.log('New message has arrived.');

	let data = msg.data;

	if(data.action === 'processCrawlerData'){
		processCrawlerData(data.fileName);
	}
});

function processCrawlerData(fileName){
	console.log('Reading ' + fileName);

	let resStr = '';

	function saveData(){
		let guid = uuid.v4();
		let sw = new StorageWriter();
		sw.init(guid + '.txt');
		sw.write(resStr);

		console.log("Data was saved to the cloud!");
	}

	let sr = new StorageReader();
	sr.readLines(fileName, arr => {
	  let i = -1;

	  let func = function(){
	  	setTimeout(() => {
		  	i++;
		  	
		  	if(i >= arr.length){
		  		saveData();

		  		return;
		  	}

			console.log(`=====${i}=====`);

		  	let post = arr[i];
		  	analyzePost(post, func);
	  	}, 4000);
	  }

	  func();
	});

	function httpRequest(options, body, cb){
		let req = http.request(options, res => {
		    let responseString = '';

		    res.on('data', data => {
		        responseString += data;
		    });

		    res.on('end', () => {
		    	let res = JSON.parse(responseString);

		    	cb(res);
		    });
		});

		req.write(body);
		req.end();
	}

	function analyzePost(post, func){
	 	let url = post.images.standard_resolution.url; 

		let options = {
		    host: 'api.projectoxford.ai',
		    path: '/vision/v1.0/analyze?visualFeatures=Faces',
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		        'Ocp-Apim-Subscription-Key': 'c9d097a7fdaf42ceb5c4d959152a0ca4'
		    }
		};

		httpRequest(options, `{"url":"${url}"}`, analyzeEmotions);

		function analyzeEmotions(fres){
			let faces = fres.faces;

			if(faces.length === 0){
				func();

				return;
			}

			var options = {
			    host: 'api.projectoxford.ai',
			    path: '/emotion/v1.0/recognize',
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/json',
			        'Ocp-Apim-Subscription-Key': 'd9f320ead60b4f1998993e268de0d0f3'
			    }
			};

			httpRequest(options, `{"url":"${url}"}`, emotions => {
				processInfo(faces, emotions);

				func();
			});
		}

		function processInfo(faces, emotions){
			emotions.forEach(emo => {
				let emoRect = emo.faceRectangle;

				let emoFace = faces.find(face => {
					let faceRect = face.faceRectangle;

					return faceRect.top == emoRect.top;
				});

				if(emoFace){
					let retValue = {
						cognitive: {
							age: emoFace.age,
							gender: emoFace.gender,
							scores: emo.scores
						},
						post: post
					};

					console.dir(retValue.cognitive);
					resStr += JSON.stringify(retValue) + '\r\n';
				}
			});
		}
	}
}

