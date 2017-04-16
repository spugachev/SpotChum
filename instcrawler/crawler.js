'use strict'

const Listener = require('./listener');
const LocationSearch = require('./locationSearch');

let lst = new Listener();
lst.listen('coordinates', msg => {
	let data = msg.data;

	if(data.action === 'locationSearch'){
		let locSearch = new LocationSearch();
		locSearch.search(data.lat, data.lng);
	}
});






