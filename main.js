import {
	getUrl
} from './functions';

getUrl()
	.then( url => testUrl(url))
	.then( result => {
		
	})
	.catch( (err) => {
		console.log('Promise rejected');
		console.error(err);
		process.exit(1);
	});