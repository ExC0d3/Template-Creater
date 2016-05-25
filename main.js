import {
	getUrl,
	testUrl
} from './functions';

getUrl()
	.then( url => testUrl(url))
	.then( result => {
		console.log(result);
		process.exit(0);
	})
	.catch( (err) => {
		console.log('Promise rejected');
		console.error(err);
		process.exit(1);
	});